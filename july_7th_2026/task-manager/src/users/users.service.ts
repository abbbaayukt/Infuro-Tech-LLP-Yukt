import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
@Injectable()
export class UsersService {
    private nextId = 1;
    private users: User[] = [];

    findByUsername(username: string): User | null {
        return this.users.find((user) => user.username === username) || null;
    }

    createUser(username: string, password: string): User {
        const user: User = {
            id: this.nextId++,
            username: username,
            password: password,
        };
        this.users.push(user);
        return user;
    }
}
