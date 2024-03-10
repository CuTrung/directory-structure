import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { TypeMethod } from 'src/consts';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type_method = context.getType<string>();
    if (type_method === TypeMethod.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context).getContext();
      const req = ctx.req;
    }

    // const { getRequest } = context.switchToHttp();
    // const request = getRequest<Request>();
    // const isExistsApiKey = request.headers['x-api-key'];
    // if (!isExistsApiKey) throw new UnauthorizedException(`Api key is required`);
    return true;
  }
}
