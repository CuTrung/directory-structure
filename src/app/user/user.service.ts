import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  create(createUserInput: CreateUserInput) {
    return { age: 18, ...createUserInput };
  }

  findAll() {
    return [{ age: 18, name: 'trung' }];
  }

  findOne(id: number) {
    return { age: 18, name: 'trung id', id };
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
