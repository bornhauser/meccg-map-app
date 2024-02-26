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

          <div class="card-items _region-sites"
               *ngIf="$data.currentGuiContext.currentSiteOrRegion && $data.currentGuiContext?.currentSiteOrRegion?.type === CardType_e.Region">
            <app-site-item *ngFor="let card of $data.getSitesOfRegion($data.currentGuiContext.currentSiteOrRegion)"
                           [card]="card"
                           (onClick)="$data.onSiteOrRegionClick(card)">
            </app-site-item>
          </div>

          <button
            *ngIf="$data.currentGuiContext.currentSiteOrRegion && $data.currentGuiContext.currentSiteOrRegion.type === CardType_e.Site && !$data.currentSiteFrom"
            class="epic-button"
            (click)="$data.startJourney()">
            <div class="button-color"></div>
            <div class="button-text">
              <div>
                start Journey
              </div>
            </div>
          </button>

          <button *ngIf="$data.currentSiteFrom" class="epic-button" (click)="$data.endJourney()">
            <div class="button-color"></div>
            <div class="button-text">
              <div>
                end Journey
              </div>
            </div>
          </button>

          <button *ngIf="$data.currentSiteFrom" class="epic-button"
                  (click)="$data.openSearchSite = true">
            <div class="button-color"></div>
            <div class="button-text">
              <div>
                Sites as List
              </div>
            </div>
          </button>
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
