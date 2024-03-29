import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {CardType_e} from '../interfaces/interfaces';
import {AppService} from '../services/app-service';
import {CardUtilService} from '../services/card-util.service';

@Component({
  selector: 'app-footer',
  template: `
    <div class="footer" [ngClass]="{ '_active': $data.currentGuiContext_persistent.currentSiteOrRegion }">
      <div class="line-1"></div>
      <div class="line-2"></div>
      <div class="footer-content">
        <!-- LEFT-->

        <div class="card-container _left">
          <div class="meccg-card-image"
               *ngIf="$data.currentGuiContext_persistent.currentSiteOrRegion as card"
               (click)="$app.zoomCard = card"
               [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$cardUtil.isRegionCardQueer(card) }"
               [style.background-image]="'url(' + $cardUtil.getCardImageUrl(card) + ')'">
            <div class="meccg-card-inner"></div>
          </div>
        </div>
        <!-- MIDDLE-->
        <div class="middle-content">
          <div class="footer-route-containter"
               *ngIf="$data.currentGuiContext_notPersitent.currentJourneyRegions.length || $data.currentGuiContext_notPersitent.currentJourneySiteTo">
            <app-route></app-route>
          </div>
          <div class="buttons-container" *ngIf="$data.currentGuiContext_persistent.currentSiteOrRegion?.type === CardType_e.Site">
            <button class="epic-button" (click)="$data.startJourney()"
                    *ngIf="$data.currentGuiContext_persistent.currentSiteOrRegion && $data.currentGuiContext_persistent.currentSiteOrRegion.type === CardType_e.Site && !$data.currentGuiContext_notPersitent.currentJourneySiteFrom">
              <div class="button-text">{{ 'app.startJourney' | translate }}</div>
            </button>
            <button class="epic-button" *ngIf="$data.currentGuiContext_notPersitent.currentJourneySiteFrom"
                    (click)="$app.openSiteSelectionModal = true">
              <div class="button-text">{{ 'app.sitesAsList' | translate }}</div>
            </button>
            <button class="epic-button" *ngIf="$data.currentGuiContext_notPersitent.currentJourneySiteFrom"
                    (click)="$data.endJourney()">
              <div class="button-text">{{ 'app.endJourney' | translate }}</div>
            </button>
          </div>
          <div class="card-items _region-sites"
               *ngIf="$data.currentGuiContext_persistent.currentSiteOrRegion && $data.currentGuiContext_persistent?.currentSiteOrRegion?.type === CardType_e.Region">
            <app-site-item
              *ngFor="let card of $data.currentGuiContext_persistent.currentSitesOfRegion"
              [card]="card"
              (onClick)="$data.onSiteOrRegionClick(card)">
            </app-site-item>
          </div>
        </div>
        <!-- RIGHT-->
        <div class="card-container _right" *ngIf="$data.currentGuiContext_notPersitent.currentJourneySiteTo as card">
          <div class="meccg-card-image"
               (click)="$app.zoomCard = card"
               [style.background-image]="'url(' + $cardUtil.getCardImageUrl(card) + ')'">
            <div class="meccg-card-inner"></div>
            <button class="remove-site-button"></button>
          </div>
        </div>
        <div class="placeholder" *ngIf="!$data.currentGuiContext_notPersitent.currentJourneySiteTo"></div>
      </div>
    </div>
  `,
})

export class FooterComponent {

  CardType_e = CardType_e;

  constructor(
    public $data: DataService,
    public $app: AppService,
    public $cardUtil: CardUtilService,
  ) {
  }

}
