import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { MongoService } from 'src/common/db/nosql/mongo/mongo.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mongoService: MongoService<User>
  ) {
    this.mongoService.setModel = this.userModel;
  }
  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.mongoService.find(
      {},
      {
        __v: 0,
      }
    );
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
