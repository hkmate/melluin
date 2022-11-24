import {Injectable} from '@nestjs/common';
import {User} from './user';
import {Role} from '../auth/constant/role.enum';

@Injectable()
export class UserService {
    private readonly users: Array<User> = [
        {
            id: '2773a6c5-57c7-4142-a89c-eec8e51655fd',
            userName: 'admin',
            roles: [Role.SYSADMIN, Role.USER],
            password: '$2b$10$dwqKuuuUfVJItfVCe4ZMXu/uk1mZAhWT7ajYtwmZV1OO2Irk.Ylay', // password: admin
        },
        {
            id: 'c59c7571-5751-4b37-9029-e9063373c56c',
            userName: 'john',
            roles: [Role.USER],
            password: '$2b$10$dwqKuuuUfVJItfVCe4ZMXu/uk1mZAhWT7ajYtwmZV1OO2Irk.Ylay', // password: admin
        },
    ];

    public async findOne(username: string): Promise<User | undefined> {
        return this.users.find((user: User) => user.userName === username);
    }
}
