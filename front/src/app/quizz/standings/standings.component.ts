import { QuizzService, QuizzModel, UserResponses } from '../quizz.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit, OnDestroy {
  responses: UserResponses[] = [];
  subs: Subscription[] = [];

  constructor(private quizzService: QuizzService, public dialog: MatDialog) {
    this.quizzService.listAnswers();
    this.subs.push(
      this.quizzService.responses$.subscribe((responses) => {
        this.responses = responses;
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

  /**
   * Should be calculated before, here it will call this method each time angular refresh the dom
   */
  getTotalRightAnswer(responses: UserResponses): number {
    return responses.responses.reduce((total, current) => {
      return current.rightAnswer + total;
    }, 0);
  }
}
