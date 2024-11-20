import { IsEmail, IsString, MinLength } from 'class-validator';
import { type TRegisterSchema } from '@repo/shared-types';

export class CreateUserDto implements TRegisterSchema {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
