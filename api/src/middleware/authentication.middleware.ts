import { ExpressMiddlewareInterface } from 'routing-controllers';
import * as jwt from 'jsonwebtoken';
const users = [
  {
    username: 'john',
    password: 'password123admin',
    role: 'admin',
  },
  {
    username: 'oualid',
    password: '123456789',
    role: 'member',
  },
  {
    username: 'bob',
    password: '123456789',
    role: 'member',
  },
  {
    username: 'tom',
    password: '123456789',
    role: 'member',
  },
];

const accessTokenSecret = 'youraccesstokensecret' || process.env.JWT_TOKEN;

export interface UserModel {
  username: string;
}
export class AuthenticationService {
  public static async getUserByToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token.substr('Bearer '.length, token.length),
        accessTokenSecret,
        (err, user) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        }
      );
    });
  }

  public static login(username: string, password: string) {
    // Filter user from the users array by username and password
    let user = users.find((u) => {
      return u.username === username && u.password === password;
    });

    if (user) {
      user = { ...user };
      // Generate an access token
      delete user.password;
      return {
        token: jwt.sign(
          { username: user.username, role: user.role },
          accessTokenSecret
        ),
        user,
      };
    }
    throw new Error('username or password does not match');
  }
}
