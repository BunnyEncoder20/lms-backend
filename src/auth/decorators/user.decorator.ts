import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/**
 * Custom decorator to extract the user Object or a specific property
 * from the request after it has passed through an AuthGuard
 * looks like: @User()
 */

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // 1. Get the http request obj
    const request = ctx.switchToHttp().getRequest<Request>();

    // 2. The user object was atteached by the strategy after validations
    const user = request.user;

    // 3. Return a specific property (if data is provided) or the whole user obj
    // * Bracket notation is Js way of accessing dynamic property names of a obejct (cause the key is a string variable)
    return data ? user?.[data] : user;
  },
);
