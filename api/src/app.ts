import { QuizzController } from './modules/quizz/quizz.controller';
import { UserController } from './modules/users/users.controller';
import { AuthenticationController } from './modules/authentication/authentication.controller';
import 'reflect-metadata';
import { AuthenticationService } from './middleware/authentication.middleware';
// this shim is required
import {
  Action,
  createExpressServer,
  useExpressServer,
} from 'routing-controllers';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

useExpressServer(server, {
  currentUserChecker: async (action: Action) => {
    // here you can use request/response objects from action
    // you need to provide a user object that will be injected in controller actions
    // demo code:
    const token = action.request.headers['authorization'];
    return await AuthenticationService.getUserByToken(token);
  },
  controllers: [UserController, AuthenticationController, QuizzController], // we specify controllers we want to use
});

// creates express app, registers all controller routes and returns you express app instance
// const app = createExpressServer();

console.log('STARTED');
// run express application on port 3000
server.listen(3000);
