import {Component} from '@angular/core';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-header',
  template: `
    <div class="header">
      <div class="line-1"></div>
      <div class="line-2"></div>
      <div class="header-content" *ngIf="$data.currentSiteTo && $data.currentRouteRegions.length">
        <app-route [reversed]="true"></app-route>
      </div>
      <div (click)="$data.openMainMenuModal = true" class="main-menu-button">
        <div class="menu-circle">
          <div class="line _1"></div>
          <div class="line _2"></div>
          <div class="line _3"></div>
        </div>
      </div>
    </div>
  `,
})

export class HeaderComponent {

  constructor(
    public $data: DataService
  ) {

  }
}
