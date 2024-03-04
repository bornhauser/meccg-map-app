import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataService} from '../services/data.service';
import {Card_i, Playable_e} from '../interfaces/interfaces';

@Component({
  selector: 'app-site-item',
  template: `
    <div class="site-button" *ngIf="card" (click)="onClick.emit(card)">
      <div class="meta-container">
        <div class="meta" *ngIf="this.$data.getPlayables(card) as playables">
          <div class="playable _minor" *ngIf="playables?.[Playable_e.minor]"></div>
          <div class="playable _major" *ngIf="playables?.[Playable_e.major]"></div>
          <div class="playable _greater" *ngIf="playables?.[Playable_e.greater]"></div>
          <div class="playable _gold_ring" *ngIf="playables?.[Playable_e.gold_ring]"></div>
          <div class="playable _information" *ngIf="playables?.[Playable_e.information]"></div>
<!--          <div class="playable _palantiri" *ngIf="playables?.[Playable_e.palantiri]"></div>-->
<!--          <div class="playable _scrol_of_isildur" *ngIf="playables?.[Playable_e.scrol_of_isildur]"></div>-->
        </div>
      </div>
      <div class="pergament-container">
        <div class="pergament">
          <div class="site-icon" [style.background-image]="'url(' + $data.getSiteIconUrl(card) + ')'"></div>
          <div class="site-title">
            {{ this.$data.getCardTitle(card) }}
          </div>
        </div>
      </div>
<!--      <div class="creature-icon" *ngIf="$data.getCreatureId(card)"-->
<!--           [style.background-image]="'url(' + $data.getCreatureIconUrl(card) + ')'"></div>-->
    </div>

  `,
})
export class SiteItemComponent {

  Playable_e = Playable_e;
  @Input() public card: Card_i | null = null;
  @Output() public onClick = new EventEmitter<Card_i>();

  constructor(
    public $data: DataService
  ) {
  }
}
