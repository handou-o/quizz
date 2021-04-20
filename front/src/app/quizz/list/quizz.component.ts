import { QuizzService, QuizzModel, UserResponses } from '../quizz.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss'],
})
export class QuizzComponent implements OnInit, OnDestroy {
  quizz: QuizzModel[] = [];
  quizzSelected: QuizzModel;
  subs: Subscription[] = [];
  answers: any = {};

  constructor(private quizzService: QuizzService, public dialog: MatDialog) {
    this.subs.push(
      this.quizzService.quizz$.subscribe((quizz) => {
        this.quizz = quizz;
      })
    );
  }

  ngOnInit(): void {}

  selectQuizz(selected: any): void {
    this.quizzSelected = this.quizz[selected.value];
    this.answers = {};
  }

  loadMoreQuizz(): any {
    this.quizzService.loadMore();
  }

  answerSelected(index: number, event): any {
    this.answers[index] = event.value;
    console.log(this.answers);
  }

  async postAnswer(): Promise<void> {
    await this.quizzService.postAnswer(this.quizzSelected.id, this.answers);
    this.quizzSelected = null;
    const dialogRef = this.dialog.open(DialogResultComponent);

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
}

@Component({
  selector: 'app-dialog-result',
  template: `
    <h1 mat-dialog-title>Answers saved !</h1>
    <div mat-dialog-content>
      <p>Why not selecting a new quizz ?</p>
    </div>
    <div mat-dialog-actions style="min-width: 300px">
      <button mat-raised-button (click)="close()">New Quizz</button>
      <a
        mat-raised-button
        (click)="close()"
        color="secondary"
        class="ml-auto"
        routerLink="/quizz/standings"
        >See Standings</a
      >
    </div>
  `,
})
export class DialogResultComponent {
  constructor(public dialogRef: MatDialogRef<DialogResultComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
