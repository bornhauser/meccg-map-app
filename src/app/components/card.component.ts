import {Component, Input} from '@angular/core';
import {Card_i} from '../interfaces/interfaces';

@Component({
  selector: 'app-card',
  template: `
    <div>
      {{ card?.title }}
            <div class="meccg-card-image" [style.background-image]="'url(' + getImageUrl(card) + ')'">
              <div class="meccg-card-inner"></div>
            </div>
    </div>
  `,
})
export class CardComponent {

  @Input() public card: Card_i | null = null;

  public getImageUrl(card: Card_i | null): string {
    return 'https://cardnum.net/img/cards/' + card?.set_code + '/' + card?.ImageName;
  }
}
