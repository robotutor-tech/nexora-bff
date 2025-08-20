import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { User } from './types/user'
import { RegisterUserSchema } from './schema/registerUser.schema'
import { ZodValidationPipe } from '@shared'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  create(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.userService.registerUser(registerUserDto)
  }

  @Get('me')
  me(): Promise<User> {
    return this.userService.me()
  }
}
