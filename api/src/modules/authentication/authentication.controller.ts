import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
} from 'routing-controllers';
import { AuthenticationService } from '../../middleware/authentication.middleware';

interface LoginModel {
  username: string;
  password: string;
}

@Controller()
export class AuthenticationController {
  @Post('/login')
  login(@Body() data: LoginModel) {
    return AuthenticationService.login(data.username, data.password);
  }
}
