const axios = require('axios');

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
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizzModel {
  id: number;
  questions: QuestionModel[];
}

export interface Response {
  quizzId: number;
  rightAnswer: number;
}

export interface UsersResponse {
  username: string;
  responses: Response[];
}
export class QuizzService {
  private static quizz: QuizzModel[] = [];
  private static response: UsersResponse[] = [];

  public static async loadNewQuizz(many = 5) {
    for (let i = 0; i < many; i++) {
      try {
        const response: any = await axios.get(
          'https://opentdb.com/api.php?amount=5'
        );
        const data: ApiResult = response.data;
        this.quizz.push({
          id: this.quizz.length,
          questions: data.results,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  public static getQuizzById(id: number) {
    return this.quizz.find((q) => q.id === id);
  }

  public static setUserAnswer(
    quizzId: number,
    answers: { [id: number]: string },
    username: string
  ) {
    const quizz: QuizzModel = this.getQuizzById(quizzId);
    if (!quizz) throw new Error('quizz not Found');
    let rightAnswer = 0;
    for (const i of Object.keys(answers)) {
      if (answers[i] === quizz.questions[i].correct_answer) rightAnswer++;
    }

    let userResponseIndex = this.response.findIndex(
      (r) => r.username === username
    );
    if (userResponseIndex === -1) {
      userResponseIndex = this.response.length;
      this.response.push({ username, responses: [] });
    }

    this.response[userResponseIndex].responses.push({ quizzId, rightAnswer });

    return this.response[userResponseIndex];
  }

  public static async getAllQuizz(): Promise<QuizzModel[]> {
    if (this.quizz.length === 0) await this.loadNewQuizz();
    const quizzClone = JSON.parse(JSON.stringify(this.quizz)); // only way to deep clone
    return quizzClone.map((q) => {
      let quizz = q;
      quizz.questions = quizz.questions.map((quest) => {
        const questClone = { ...quest };
        const answers = [
          questClone.correct_answer,
          ...questClone.incorrect_answers,
        ];
        return {
          ...questClone,
          answers,
          correct_answer: null,
          incorrect_answers: null,
        };
      });
      return quizz;
    });
  }

  public static getAllResponse() {
    return this.response;
  }
}
