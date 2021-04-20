import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ApiResult {
  response_code: number;
  results: QuestionModel[];
}

export interface QuestionModel {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  answers: string[];
}

export interface QuizzModel {
  id: number;
  questions: QuestionModel[];
}

export interface Response {
  quizzId: number;
  rightAnswer: number;
}

export interface UserResponses {
  username: string;
  responses: Response[];
}

@Injectable()
export class QuizzService {
  public quizz$ = new BehaviorSubject<QuizzModel[]>([]);
  public responses$ = new BehaviorSubject<UserResponses[]>([]);

  constructor(private httpClient: HttpClient) {
    this.listQuizz();
    this.listAnswers();
  }

  async listQuizz(): Promise<QuizzModel[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get('/api/quizz/').subscribe(
        (result: any) => {
          this.quizz$.next(result);
          resolve(result);
        },
        (err) => reject
      );
    });
  }

  loadMore(): Promise<QuizzModel[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`/api/quizz/more`).subscribe(
        (result: any) => {
          this.quizz$.next(result);
          resolve(result);
        },
        (err) => reject
      );
    });
  }

  async postAnswer(
    id: number,
    answers: { [id: string]: string }
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(`/api/quizz/${id}`, { responses: answers })
        .subscribe(
          (result: any) => {
            resolve(result);
            this.listAnswers();
          },
          (err) => reject
        );
    });
  }

  async listAnswers(): Promise<UserResponses[]> {
    return new Promise((resolve, reject) => {
      this.httpClient.get('/api/quizz/results').subscribe(
        (result: any) => {
          this.responses$.next(result);
          resolve(result);
        },
        (err) => reject
      );
    });
  }
}
