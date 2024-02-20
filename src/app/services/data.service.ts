import {Injectable} from '@angular/core';
import {Card_i, CardType_e} from '../interfaces/interfaces';

declare var meccgCards: Card_i[] | undefined;

@Injectable()
export class DataService {

  public cards: Card_i[] = [];

  constructor() {
    if (meccgCards?.length) {
      this.cards = meccgCards;
    }

  }

  public getSites(): Card_i[] {
    return this.cards?.filter((card)=>{
      return card.type === CardType_e.Region;
    });

  }


}
