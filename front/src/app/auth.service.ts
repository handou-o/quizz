import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface UserModel {
  username: string;
  game: any[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);
  public user$ = new BehaviorSubject<UserModel>(null);

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private sessionStorageService: LocalStorageService
  ) {
    const token = this.sessionStorageService.get('token', false);
    const user = this.sessionStorageService.get('username', false);
    if (token == null || user == null) {
      return;
    }

    this.user$.next(user);
  }

  checkAuthenticated(): boolean {
    if (this.user$.getValue()) {
      return true;
    }
    return false;
  }

  login(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.post('/api/login', { username, password }).subscribe(
        (result: any) => {
          this.sessionStorageService.set('token', result.token, false);
          this.sessionStorageService.set('username', result.user, true);
          this.user$.next(result.user);
          this.router.navigate(['/quizz']);
          resolve();
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  async logout(): Promise<void> {
    this.sessionStorageService.del('token');
    this.sessionStorageService.del('username');
    this.user$.next(null);
    this.router.navigate(['/login']);
  }
}
