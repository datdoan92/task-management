import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the User',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email!: string;

  @ApiProperty({
    description: 'The password of the User',
    example: 'password',
  })
  @IsNotEmpty()
  readonly password!: string;
}
