import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ZodError, ZodIssue, ZodSchema } from 'zod';
import { ResponseZodError } from './validate.type';

@Injectable()
export class ValidatePipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  handleZodErrors(errors: ResponseZodError[]) {
    return errors.map(
      (item) => `\`${item.path[0]}\` ${item.message.toLowerCase()}`,
    );
  }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      console.log('>>> valid', parsedValue);

      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        error = this.handleZodErrors(error.errors);
      }

      throw new BadRequestException(error);
    }
  }
}
