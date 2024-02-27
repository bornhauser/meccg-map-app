import {Component} from '@angular/core';
import 'leaflet.markercluster';
import {DataService} from '../services/data.service';
import {CardType_e} from '../interfaces/interfaces';

@Component({
  selector: 'app-footer',
  template: `
    <div class="footer" [ngClass]="{ '_active': $data.currentGuiContext.currentSiteOrRegion }">
      <div class="line-1"></div>
      <div class="line-2"></div>
      <div class="footer-content">

        <!-- LEFT-->
        <div class="meccg-card-image _left"
             *ngIf="$data.currentGuiContext.currentSiteOrRegion as card"
             (click)="$data.zoomCard = card"
             [ngClass]="{ '_region': card.type === CardType_e.Region, '_queer': this.$data.isRegionCardQueer(card) }"
             [style.background-image]="'url(' + $data.getCardImageUrl(card) + ')'">
          <div class="meccg-card-inner"></div>
          <button class="remove-site-button"></button>
        </div>

        <!-- MIDDLE-->
        <div class="middle-content">

          <div class="footer-route-containter" *ngIf="$data.currentRouteRegions.length">
            <app-route *ngIf="$data.currentRouteRegions.length"></app-route>
          </div>

          <div class="buttons">
            <button class="epic-button" (click)="$data.startJourney()"
                    *ngIf="$data.currentGuiContext.currentSiteOrRegion && $data.currentGuiContext.currentSiteOrRegion.type === CardType_e.Site && !$data.currentSiteFrom">
              <div class="button-text">start Journey</div>
            </button>

            <button class="epic-button" *ngIf="$data.currentSiteFrom" (click)="$data.endJourney()">
              <div class="button-text">end Journey</div>
            </button>

            <button class="epic-button" *ngIf="$data.currentSiteFrom" (click)="$data.openSiteSelectionModal = true">
              <div class="button-text">Sites as List</div>
            </button>
          </div>

          <div class="card-items _region-sites"
               *ngIf="$data.currentGuiContext.currentSiteOrRegion && $data.currentGuiContext?.currentSiteOrRegion?.type === CardType_e.Region">
            <app-site-item *ngFor="let card of $data.getSitesOfRegion($data.currentGuiContext.currentSiteOrRegion)"
                           [card]="card"
                           (onClick)="$data.onSiteOrRegionClick(card)">
            </app-site-item>
          </div>
        </div>

        <!-- RIGHT-->
        <div class="meccg-card-image _right"
             *ngIf="$data.currentSiteTo as card"
             (click)="$data.zoomCard = card"
             [style.background-image]="'url(' + $data.getCardImageUrl(card) + ')'">
          <div class="meccg-card-inner"></div>
          <button class="remove-site-button"></button>
        </div>

        <div class="placeholder" *ngIf="!$data.currentSiteTo"></div>
      </div>
    </div>
  `,
})

export class FooterComponent {

  CardType_e = CardType_e;

  constructor(
    public $data: DataService
  ) {
  }

}
