import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {AppService} from '../services/app-service';

@Component({
  selector: 'app-header',
  template: `
    <div class="header">
      <div class="line-1"></div>
      <div class="line-2"></div>
      <div class="header-content" *ngIf="$data.currentGuiContext_notPersitent.currentJourneySiteTo">
        <app-route [reversed]="true"></app-route>
      </div>
      <div (click)="toggleUnderdeep()" [ngClass]="{'_active': $data.currentGuiContext_persistent.underDeep}"
           class="underdeep-toggle-button">
        <div class="menu-circle"></div>
      </div>
      <div (click)="toggleTurnDisplay()" class="turn-toggle-button">
        <div class="menu-circle"></div>
      </div>
      <div (click)="$app.openMainMenuModal = true" class="main-menu-button">
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
    public $data: DataService,
    public $app: AppService,
  ) {

  }

  public toggleTurnDisplay() {
    this.$app.turnDisplay = !this.$app.turnDisplay;
  }

  public toggleUnderdeep() {
    this.$data.resetCurrentGuiContext();
    this.$data.currentGuiContext_persistent.underDeep = !this.$data.currentGuiContext_persistent.underDeep;
    this.$data.saveCurrentStates();
  }
}
