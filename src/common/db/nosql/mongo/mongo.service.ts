import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class MongoService<M> {
  private model: Model<M>;
  private fields: {} = {
    _id: 0,
    __v: 0,
  };

  pick(
    fields: string[] = [],
    filter?: FilterQuery<M>,
    options?: QueryOptions<M>
  ): Promise<M[]> {
    const fieldsSelected = { ...this.fields };
    for (const field of fields) {
      if (field in fieldsSelected) delete fieldsSelected[field];
    }
    return this.find(filter, fieldsSelected, options);
  }

  omit(
    fields: string[] = [],
    filter?: FilterQuery<M>,
    options?: QueryOptions<M>
  ): Promise<M[]> {
    return this.pick(
      Object.keys(this.fields).filter((field) => !fields.includes(field)),
      filter,
      options
    );
  }
  find(
    filter?: FilterQuery<M>,
    projection?: ProjectionType<M>,
    options?: QueryOptions<M>
  ): Promise<M[]> {
    return this.model.find(filter, projection, options).exec();
  }

  setModel(model: Model<M>) {
    this.model = model;
    this.setFieldsModel();
  }

  private setFieldsModel() {
    const fields = Object.keys(this.model.schema.obj);
    const fieldsObj = {};
    for (const field of fields) {
      fieldsObj[field] = 0;
    }
    this.fields = { ...this.fields, ...fieldsObj };
  }
}
