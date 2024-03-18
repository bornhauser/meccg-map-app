import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataService} from '../services/data.service';
import {Card_i, Playable_e} from '../interfaces/interfaces';
import {CardUtilService} from '../services/card-util.service';

@Component({
  selector: 'app-site-item',
  template: `
    <div class="site-button" *ngIf="card" (click)="onClick.emit(card)"
         [ngClass]="{'_under-deep': $cardUtils.isUnderDeepSite(card)}">
      <div class="meta-container" *ngIf="$cardUtils.getPlayablesOfCard(card) as playables">
        <div class="meta">
          <div class="playable _minor" *ngIf="playables?.[Playable_e.minor]"></div>
          <div class="playable _major" *ngIf="playables?.[Playable_e.major]"></div>
          <div class="playable _greater" *ngIf="playables?.[Playable_e.greater]"></div>
          <div class="playable _gold_ring" *ngIf="playables?.[Playable_e.gold_ring]"></div>
          <div class="playable _information" *ngIf="playables?.[Playable_e.information]"></div>
          <div class="playable _dragon-hoard" *ngIf="playables?.[Playable_e.dragonHoard]"></div>
          <!--          <div class="playable _palantiri" *ngIf="playables?.[Playable_e.palantiri]"></div>-->
          <!--          <div class="playable _scrol_of_isildur" *ngIf="playables?.[Playable_e.scrol_of_isildur]"></div>-->
        </div>
      </div>
      <div class="pergament-container">
        <div class="pergament">
          <div class="site-icon" [style.background-image]="'url(' + $cardUtils.getSiteIconUrl(card) + ')'"></div>
          <div class="site-title">
            {{ this.$cardUtils.getCardTitle(card) }}
          </div>
          <div class="creature-icon" *ngIf="$cardUtils.getCreatureId(card)"
               [style.background-image]="'url(' + $cardUtils.getCreatureIconUrl(card) + ')'">
          </div>
        </div>
      </div>
    </div>

  `,
})
export class SiteItemComponent {

  Playable_e = Playable_e;
  @Input() public card: Card_i | null = null;
  @Output() public onClick = new EventEmitter<Card_i>();

  constructor(
    public $data: DataService,
    public $cardUtils: CardUtilService,
  ) {
  }
}
