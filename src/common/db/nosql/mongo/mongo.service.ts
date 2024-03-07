import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class MongoService<M> {
  private model: Model<M>;
  find(
    filter?: FilterQuery<M>,
    projection?: ProjectionType<M>,
    options?: QueryOptions<M>
  ): Promise<M[]> {
    return this.model.find(filter, projection, options).exec();
  }

  set setModel(model: Model<M>) {
    this.model = model;
  }
}
