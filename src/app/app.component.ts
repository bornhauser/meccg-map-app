import {Component} from '@angular/core';
import {DataService} from './services/data.service';

@Component({
  selector: 'app-root',
  template: `
    <app-map></app-map>
    <app-footer></app-footer>
  `,
})
export class AppComponent {

  constructor(
    public $data: DataService
  ) {
  }
}
