import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export interface CurrentUserOptions {
  required?: boolean;
}

export const CurrentUserREST: (options?: CurrentUserOptions) => ParameterDecorator = createParamDecorator((options: CurrentUserOptions = {}, req) => {
  const user = req.user;
  if (options.required && !user) {
    throw new UnauthorizedException();
  }
  return user;
});
