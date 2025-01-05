import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  Matches,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
  @IsOptional()
  @IsString()
  image: string;
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must only contain alphanumeric characters',
  })
  username: string;
}
