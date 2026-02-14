import {Injectable} from '@nestjs/common';
import {EntityManager} from 'typeorm';
import {OperationCity} from '@shared/person/operation-city';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {VisitByDepartmentsRowItem} from '@be/statistics/model/visit-by-departments-row-item';
import {ChildrenByDepartmentsRowItem} from '@be/statistics/model/children-by-departments-row-item';
import {VisitStatusCountRowItem} from '@be/statistics/model/visit-status-count-row-item';
import {VolunteerByDepartmentsRowItem} from '@be/statistics/model/volunteer-by-departments-row-item';
import {ActivitiesCountRowItem} from '@be/statistics/model/activities-count-row-item';
import {ChildAgesByDepartmentsRowItem} from '@be/statistics/model/child-ages-by-departments-row-item';
import {VisitsCountByWeekDayRowItem} from '@be/statistics/model/visits-count-by-week-day-row-item';
import {VolunteersVisitStatRowItem} from '@be/statistics/model/volunteers-visit-stat-row-item';

/* eslint-disable max-lines-per-function */
@Injectable()
export class StatisticsDao {

    constructor(private readonly em: EntityManager) {
    }

    public getVisitsByWeekDay(from: string, to: string, city: OperationCity): Promise<Array<VisitsCountByWeekDayRowItem>> {
        return this.em.query(`
            SELECT EXTRACT(DOW FROM datetime_from)                                as week_day,
                   COUNT(DISTINCT hv.group_id)                                    AS visit_groups,
                   COUNT(DISTINCT hv.group_id) FILTER ( WHERE group_id != hv.id ) AS pure_visit_groups,
                   COUNT(hv.id)                                                   AS visits,
                   COALESCE(SUM(hv.counted_minutes), 0)                           AS visit_minutes,
                   COUNT(*) FILTER ( WHERE vicarious_mom_visit = TRUE )           AS vicarious_mom_visit
            FROM hospital_visit hv
            WHERE datetime_from < ($2)::timestamp
              AND datetime_to > ($1)::timestamp
              AND status in ('ACTIVITIES_FILLED_OUT', 'ALL_FILLED_OUT', 'SUCCESSFUL')
              AND department_id IN (SELECT id
                                    FROM hospital_department
                                    WHERE valid_from < ($2)::timestamp
                                      AND valid_to > ($1)::timestamp
                                      AND city = $3)
            GROUP BY EXTRACT(DOW FROM datetime_from)
        `, [from, to, city]);
    }

    public getVisitsByDepartments(from: string, to: string, city: OperationCity): Promise<Array<VisitByDepartmentsRowItem>> {
        return this.em.query(`
            SELECT hd.id                                AS department_id,
                   hd.name                              AS department_name,
                   count(hv.id)                         AS visit_count,
                   COALESCE(sum(hv.counted_minutes), 0) AS visit_minutes
            FROM hospital_department hd
                     LEFT OUTER JOIN (SELECT *
                                      FROM hospital_visit
                                      WHERE datetime_from < $2::timestamp
                                        AND datetime_to > $1::timestamp
                                        AND status IN ('ACTIVITIES_FILLED_OUT', 'ALL_FILLED_OUT', 'SUCCESSFUL')) hv
                                     ON hv.department_id = hd.id
            WHERE hd.valid_from < ($2)::timestamp
              AND hd.valid_to > ($1)::timestamp
              AND hd.city = $3
            GROUP BY hd.id, hd.name
            ORDER BY hd.name
        `, [from, to, city]);
    }

    public getChildrenByDepartments(from: string, to: string, city: OperationCity): Promise<Array<ChildrenByDepartmentsRowItem>> {
        return this.em.query(`
            SELECT hd.id                                               AS department_id,
                   hd.name                                             AS department_name,
                   count(cv.id)                                        AS child_contact,
                   count(DISTINCT cv.child_id)                         AS child,
                   count(*) FILTER ( WHERE cv.is_parent_there = true ) AS child_with_relative_present
            FROM (SELECT id, name
                  FROM hospital_department
                  WHERE valid_from < ($2)::timestamp
                    AND valid_to > ($1)::timestamp
                    AND city = $3) hd
                     LEFT OUTER JOIN (SELECT *
                                      FROM hospital_visit
                                      WHERE datetime_from < ($2)::timestamp
                                        AND datetime_to > ($1)::timestamp
                                        AND status IN ('ACTIVITIES_FILLED_OUT', 'ALL_FILLED_OUT', 'SUCCESSFUL')) hv
                                     ON hv.department_id = hd.id
                     LEFT OUTER JOIN children_in_visit cv ON cv.visit_id = hv.id
            GROUP BY hd.id, hd.name
            ORDER BY hd.name
        `, [from, to, city]);
    }

    public getVisitsByStatuses(from: string, to: string, city: OperationCity): Promise<Array<VisitStatusCountRowItem>> {
        return this.em.query(`
            SELECT s.status, count(hv.id)
            FROM (SELECT status
                  FROM (${this.getStaticValuesFromEnum(HospitalVisitStatus)}) x(status)) s
                     LEFT OUTER JOIN (SELECT hv.status, hv.id
                                      FROM hospital_visit hv
                                               JOIN hospital_department hd ON hv.department_id = hd.id
                                      WHERE hd.valid_from < ($2)::timestamp
                                        AND hd.valid_to > ($1)::timestamp
                                        and hd.city = $3
                                        AND hv.datetime_from < ($2)::timestamp
                                        AND hv.datetime_to > ($1)::timestamp) hv ON hv.status = s.status
            GROUP BY s.status
        `, [from, to, city]);
    }

    public getVolunteersByDepartments(from: string, to: string, city: OperationCity): Promise<Array<VolunteerByDepartmentsRowItem>> {
        return this.em.query(`
            SELECT p.id                                 AS person_id,
                   p.name                               AS person_name,
                   hd.id                                AS department_id,
                   hd.name                              AS department_name,
                   count(hv.id)                         AS visit_count,
                   COALESCE(sum(hv.counted_minutes), 0) AS visit_minutes
            FROM (SELECT pp.id, concat_ws(' ', last_name, first_name) AS name, ua.*
                  FROM (SELECT * FROM person WHERE cities ? $3) pp
                           JOIN public."user" u ON u.person_id = pp.id
                           JOIN (((SELECT user_id, count(action) FILTER ( WHERE action = 'ACTIVATE' ) AS activations
                                   FROM user_activation
                                   WHERE created_at < ($2)::timestamp
                                     AND created_at > ($1)::timestamp
                                   GROUP BY user_id, created_at
                                   ORDER BY created_at DESC)
                                  UNION
                                  (SELECT user_id, count(action) FILTER ( WHERE action = 'ACTIVATE' ) AS activations
                                   FROM user_activation
                                   WHERE created_at < ($1)::timestamp
                                      or created_at IS NULL
                                   GROUP BY user_id, created_at
                                   ORDER BY created_at DESC))) ua ON u.id = ua.user_id
                  WHERE ua.activations > 0) p
                     CROSS JOIN (SELECT *
                                 FROM hospital_department
                                 WHERE valid_from < ($2)::timestamp
                                   AND valid_to > ($1)::timestamp
                                   and city = $3) hd
                     LEFT OUTER JOIN public.hospital_visit_participant hvp ON p.id = hvp.person_id
                     LEFT OUTER JOIN (SELECT *
                                      FROM hospital_visit
                                      WHERE datetime_from < ($2)::timestamp
                                        AND datetime_to > ($1)::timestamp
                                        AND status IN ('ACTIVITIES_FILLED_OUT', 'ALL_FILLED_OUT', 'SUCCESSFUL')) hv
                                     ON (hv.id = hvp.event_id AND hv.department_id = hd.id)
            GROUP BY p.id, p.name, hd.id, hd.name
            ORDER BY p.name, hd.name
        `, [from, to, city]);
    }

    public getVolunteersVisitCount(from: string, to: string, city: OperationCity): Promise<Array<VolunteersVisitStatRowItem>> {
        return this.em.query(`
            SELECT p.id                                 AS person_id,
                   p.name                               AS person_name,
                   count(distinct hv.group_id)          AS visit_count,
                   COALESCE(sum(hv.counted_minutes), 0) AS visit_minutes
            FROM (SELECT pp.id, concat_ws(' ', last_name, first_name) AS name, ua.*
                  FROM (SELECT * FROM person WHERE cities ? $3) pp
                           JOIN public."user" u ON u.person_id = pp.id
                           JOIN (((SELECT user_id, count(action) FILTER ( WHERE action = 'ACTIVATE' ) AS activations
                                   FROM user_activation
                                   WHERE created_at < ($2)::timestamp
                                     AND created_at > ($1)::timestamp
                                   GROUP BY user_id, created_at
                                   ORDER BY created_at DESC)
                                  UNION
                                  (SELECT user_id, count(action) FILTER ( WHERE action = 'ACTIVATE' ) AS activations
                                   FROM user_activation
                                   WHERE created_at < ($1)::timestamp
                                      or created_at IS NULL
                                   GROUP BY user_id, created_at
                                   ORDER BY created_at DESC))) ua ON u.id = ua.user_id
                  WHERE ua.activations > 0) p
                     CROSS JOIN (SELECT *
                                 FROM hospital_department
                                 WHERE valid_from < ($2)::timestamp
                                   AND valid_to > ($1)::timestamp
                                   and city = $3) hd
                     LEFT OUTER JOIN public.hospital_visit_participant hvp ON p.id = hvp.person_id
                     LEFT OUTER JOIN (SELECT *
                                      FROM hospital_visit
                                      WHERE datetime_from < ($2)::timestamp
                                        AND datetime_to > ($1)::timestamp
                                        AND status IN ('ACTIVITIES_FILLED_OUT', 'ALL_FILLED_OUT', 'SUCCESSFUL')) hv
                                     ON (hv.id = hvp.event_id AND hv.department_id = hd.id)
            GROUP BY p.id, p.name
            ORDER BY p.name
        `, [from, to, city]);
    }

    public getActivities(from: string, to: string, city: OperationCity): Promise<Array<ActivitiesCountRowItem>> {
        return this.em.query(`
            SELECT a.act AS activity, count(hospital_visit_id) AS "count"
            FROM (SELECT act
                  FROM (${this.getStaticValuesFromEnum(VisitActivityType)}) x(act)) a
                     LEFT OUTER JOIN
                 (SELECT x_hva.*
                  FROM hospital_visit_activity x_hva
                           JOIN hospital_visit x_hv ON x_hva.hospital_visit_id = x_hv.id
                           JOIN hospital_department x_hd ON x_hd.id = x_hv.department_id
                  WHERE datetime_from < ($2)::timestamp
                    AND datetime_to > ($1)::timestamp
                    AND status IN ('ACTIVITIES_FILLED_OUT', 'ALL_FILLED_OUT', 'SUCCESSFUL')
                    AND valid_from < ($2)::timestamp
                    AND valid_to > ($1)::timestamp
                    AND city = $3) hva ON hva.activities::jsonb ? a.act
            GROUP BY a.act
        `, [from, to, city]);
    }

    public getChildAgesByDepartments(from: string, to: string, city: OperationCity): Promise<Array<ChildAgesByDepartmentsRowItem>> {
        return this.em.query(`
            SELECT hdid                                                                AS department_id,
                   hdname                                                              AS department_name,
                   count(DISTINCT childid)                                             AS sum,
                   count(DISTINCT childid) FILTER ( WHERE years < 1 and months < 6 )   AS zero_to_half,
                   count(DISTINCT childid) FILTER ( WHERE years < 1 and months >= 6 )  AS half_to_one,
                   count(DISTINCT childid) FILTER ( WHERE years >= 1 and years < 3 )   AS one_to_three,
                   count(DISTINCT childid) FILTER ( WHERE years >= 3 and years < 5 )   AS three_to_five,
                   count(DISTINCT childid) FILTER ( WHERE years >= 5 and years < 7 )   AS five_to_seven,
                   count(DISTINCT childid) FILTER ( WHERE years >= 7 and years < 9 )   AS seven_to_nine,
                   count(DISTINCT childid) FILTER ( WHERE years >= 9 and years < 11 )  AS nine_to_eleven,
                   count(DISTINCT childid) FILTER ( WHERE years >= 11 and years < 13 ) AS eleven_to_thirteen,
                   count(DISTINCT childid) FILTER ( WHERE years >= 13 and years < 15 ) AS thirteen_to_fifteen,
                   count(DISTINCT childid) FILTER ( WHERE years >= 15 and years < 17 ) AS fifteen_to_seventeen,
                   count(DISTINCT childid) FILTER ( WHERE years >= 17 )                AS seventeen_to_up
            FROM (SELECT hd.id                                               AS hdid,
                         hd.name                                             AS hdname,
                         cv.child_id                                         AS childid,
                         EXTRACT(YEAR FROM age(hv.datetime_from, cp.birth))  AS years,
                         EXTRACT(MONTH FROM age(hv.datetime_from, cp.birth)) AS months
                  FROM (SELECT id, name
                        FROM hospital_department
                        WHERE valid_from < ($2)::timestamp
                          AND valid_to > ($1)::timestamp
                          and city = $3) hd
                           LEFT OUTER JOIN (SELECT *
                                            FROM hospital_visit
                                            WHERE datetime_from < ($2)::timestamp
                                              AND datetime_to > ($1)::timestamp
                                              AND status IN ('ACTIVITIES_FILLED_OUT', 'ALL_FILLED_OUT', 'SUCCESSFUL')) hv
                                           ON hv.department_id = hd.id
                           LEFT OUTER JOIN children_in_visit cv ON cv.visit_id = hv.id
                           LEFT OUTER JOIN (SELECT id, TO_DATE(guessed_birth, 'YYYY.MM') AS birth FROM child_patient) cp
                                           ON cv.child_id = cp.id) main
            GROUP BY hdid, hdname
            ORDER BY hdname
        `, [from, to, city]);
    }

    private getStaticValuesFromEnum(enumType: object): string {
        const enumValues = Object.values(enumType);
        return 'values ' + enumValues.map(x => `('${x}')`).join(', ');
    }

}
