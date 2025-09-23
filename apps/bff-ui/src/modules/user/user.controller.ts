import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { RegisterUserSchema } from './schema/registerUser.schema'
import { ZodValidationPipe } from '@shared'
import { User } from '@shared/cache/cache'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.userService.registerUser(registerUserDto)
  }

  @Get('me')
  me(): Promise<User> {
    return this.userService.me()
  }
}
