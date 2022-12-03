import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PersonEntity} from './model/person.entity';

@Injectable()
export class PersonService {

    constructor(@InjectRepository(PersonEntity) private readonly personRepository: Repository<PersonEntity>) {
    }

    public save(person: PersonEntity): Promise<PersonEntity> {
        return this.personRepository.save(person);
    }

}
