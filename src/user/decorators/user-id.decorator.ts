import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomParamFactory } from '@nestjs/common/interfaces';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request';

export const paramFactory: CustomParamFactory = (
  data: string,
  ctx: ExecutionContext,
) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user.id;
};

export const UserId = createParamDecorator(paramFactory);
