import { QuizzService } from './quizz.service';
import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  CurrentUser,
} from 'routing-controllers';
import { UserModel } from '../../middleware/authentication.middleware';

@Controller('/quizz')
export class QuizzController {
  @Get('/')
  async getAll(): Promise<any> {
    const q = await QuizzService.getAllQuizz();
    return q;
  }
  @Get('/more')
  async loadMore(): Promise<any> {
    await QuizzService.loadNewQuizz(5);
    const q = await QuizzService.getAllQuizz();
    return q;
  }

  @Post('/:id')
  getOne(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() data: { responses: { [id: number]: string } }
  ) {
    return QuizzService.setUserAnswer(
      parseInt(id),
      data.responses,
      user.username
    );
  }

  @Get('/results')
  getResults() {
    return QuizzService.getAllResponse();
  }
}
