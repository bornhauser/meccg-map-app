import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {AppService} from '../services/app-service';
import {
  AlignmentType_e,
  CurrentGuiContext_1,
  CurrentGuiContext_2,
  PlayerId_e,
  SubAlignmentType_e
} from '../interfaces/interfaces';
import {copyObject} from '../services/utility-methods';

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
           class="circle-button _underdeep">
        <div class="menu-circle"></div>
      </div>
      <div (click)="togglePlayer()"
           [ngClass]="{'_active': $data.currentGuiContext_persistent.currentPlayer === PlayerId_e.player_2}"
           class="circle-button _player">
        <div class="menu-circle"></div>
        <div class="menu-label" [innerHTML]="'app.' + $data.currentGuiContext_persistent.currentPlayer | translate "></div>
      </div>
      <div (click)="$app.openMainMenuModal = true" class="circle-button _main-menu">
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

  public togglePlayer() {
    const currentGuiContext: CurrentGuiContext_2 = this.$data.currentGuiContext_persistent;
    currentGuiContext.currentPlayer = currentGuiContext.currentPlayer === PlayerId_e.player_1 ? PlayerId_e.player_2 : PlayerId_e.player_1;
    const otherPlayersGuiContextCopy: CurrentGuiContext_1 | null = copyObject(currentGuiContext.otherPlayersGuiContext);
    currentGuiContext.otherPlayersGuiContext = {
      currentAlignment: currentGuiContext?.currentAlignment ?? AlignmentType_e.Hero,
      currentSiteOrRegion: currentGuiContext?.currentSiteOrRegion ?? null,
      currentSubAlignment_1: currentGuiContext?.currentSubAlignment_1 ?? SubAlignmentType_e.hero_default,
      currentSubAlignment_2: currentGuiContext?.currentSubAlignment_2 ?? SubAlignmentType_e.hero_default,
      underDeep: currentGuiContext?.underDeep ?? false,
    };
    currentGuiContext.currentAlignment = otherPlayersGuiContextCopy?.currentAlignment ?? AlignmentType_e.Hero;
    currentGuiContext.currentSiteOrRegion = otherPlayersGuiContextCopy?.currentSiteOrRegion ?? null;
    currentGuiContext.currentSubAlignment_1 = otherPlayersGuiContextCopy?.currentSubAlignment_1 ?? SubAlignmentType_e.hero_default;
    currentGuiContext.currentSubAlignment_2 = otherPlayersGuiContextCopy?.currentSubAlignment_2 ?? SubAlignmentType_e.hero_default;
    currentGuiContext.underDeep = otherPlayersGuiContextCopy?.underDeep ?? false;
    this.$data.saveCurrentStates();
    this.$data.refreshCalculations();
  }

  public toggleUnderdeep() {
    this.$data.resetCurrentGuiContext();
    this.$data.currentGuiContext_persistent.underDeep = !this.$data.currentGuiContext_persistent.underDeep;
    this.$data.saveCurrentStates();
    this.$data.refreshCalculations();
  }

  protected readonly PlayerId_e = PlayerId_e;
}
