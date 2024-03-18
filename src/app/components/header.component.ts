import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {AppService} from '../services/app-service';
import {AlignmentType_e, CurrentGuiContext_1, CurrentGuiContext_2, PlayerId_e} from '../interfaces/interfaces';
import {copyObject} from '../services/utility-methods';
import {MapService} from '../services/map-service';

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
      <div (click)="togglePlayer()"
           [ngClass]="{'_active': $data.currentGuiContext_persistent.currentPlayer === PlayerId_e.player_2}"
           class="turn-toggle-button">
        <div class="menu-circle"></div>
        <div class="menu-label" [innerHTML]="'app.' + $data.currentGuiContext_persistent.currentPlayer | translate "></div>
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
    public $map: MapService,
  ) {

  }

  public togglePlayer() {
    const currentGuiContext: CurrentGuiContext_2 = this.$data.currentGuiContext_persistent;
    currentGuiContext.currentPlayer = currentGuiContext.currentPlayer === PlayerId_e.player_1 ? PlayerId_e.player_2 : PlayerId_e.player_1;
    const otherPlayersGuiContextCopy: CurrentGuiContext_1 | null = copyObject(currentGuiContext.otherPlayersGuiContext);
    currentGuiContext.otherPlayersGuiContext = {
      currentAlignment: currentGuiContext?.currentAlignment ?? AlignmentType_e.Hero,
      currentSiteOrRegion: currentGuiContext?.currentSiteOrRegion ?? null,
      currentReachableRegions: currentGuiContext?.currentReachableRegions ?? [],
      currentReachableSites: currentGuiContext?.currentReachableSites ?? [],
      currentSitesOfRegion: currentGuiContext?.currentSitesOfRegion ?? [],
      underDeep: currentGuiContext?.underDeep ?? false,
    };
    currentGuiContext.currentAlignment = otherPlayersGuiContextCopy?.currentAlignment ?? AlignmentType_e.Hero;
    currentGuiContext.currentSiteOrRegion = otherPlayersGuiContextCopy?.currentSiteOrRegion ?? null;
    currentGuiContext.currentReachableRegions = otherPlayersGuiContextCopy?.currentReachableRegions ?? [];
    currentGuiContext.currentReachableSites = otherPlayersGuiContextCopy?.currentReachableSites ?? [];
    currentGuiContext.currentSitesOfRegion = otherPlayersGuiContextCopy?.currentSitesOfRegion ?? [];
    currentGuiContext.underDeep = otherPlayersGuiContextCopy?.underDeep ?? false;
    this.$data.saveCurrentStates();
    this.$map.renderRegionLabelAndSites();
  }

  public toggleUnderdeep() {
    this.$data.resetCurrentGuiContext();
    this.$data.currentGuiContext_persistent.underDeep = !this.$data.currentGuiContext_persistent.underDeep;
    this.$data.saveCurrentStates();
  }

  protected readonly PlayerId_e = PlayerId_e;
}
