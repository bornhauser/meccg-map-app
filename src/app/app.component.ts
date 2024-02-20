import {Component} from '@angular/core';
import {DataService} from './services/data.service';

@Component({
  selector: 'app-root',
  template: `
    <!--    <app-card *ngFor="let card of $data.getSites()" [card]="card"></app-card>-->

    <app-map></app-map>
  `,
})
export class AppComponent {

  constructor(
    public $data: DataService
  ) {
  }
}
