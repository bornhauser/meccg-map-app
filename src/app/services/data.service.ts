import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e, CreatureType_e, CurrentGuiContext,
  Playable_e,
  Playables_i,
  RegionType_e,
  Set_e
} from '../interfaces/interfaces';

declare var meccgCards: Card_i[] | undefined;

@Injectable()
export class DataService {

  public cards: Card_i[] = [];
  public mapIsDradding: boolean = false;

  public currentGuiContext: CurrentGuiContext = {
    currentSite: null,
    currentSiteForMove: null,
    currentSitesInReach: [],
  }

  constructor() {
    if (meccgCards?.length) {
      meccgCards.forEach((card) => {
        card.id = this.createCardId(card);
        if (card.RPath === 'Boarder-land') {
          card.RPath = RegionType_e['Border-land'];
        }
      });
      this.cards = meccgCards;
      const savedGuiContext = sessionStorage.getItem('meccg-gui-context')
      if (savedGuiContext) {
        this.currentGuiContext = JSON.parse(savedGuiContext);
      }
    }
    const sites = this.filterSites(this.filterOfficial(this.cards));
    const regions = this.filterRegions(this.filterOfficial(this.cards));
    regions.forEach((card) => {
      sites.push(card);
    })
  }

  public createCardId(card: Card_i): string {
    return card.ImageName?.replaceAll('.jpg', '') ?? '';
  }

  public saveCurrentStates() {
    sessionStorage.setItem('meccg-gui-context', JSON.stringify(this.currentGuiContext));
  }

  public filterSites(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return card.type === CardType_e.Site;
    });
  }

  public filterAlignmentMinion(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return card.alignment === AlignmentType_e.Minion;
    });
  }

  public filterAlignmentHero(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return card.alignment === AlignmentType_e.Hero;
    });
  }

  public filterAlignmentBalrog(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return card.alignment === AlignmentType_e.Balrog;
    });
  }

  public filterRegions(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return card.type === CardType_e.Region;
    });
  }

  public getPlayables(card: Card_i): Playables_i | null {
    if (card.Playable) {
      return {
        [Playable_e.scrol_of_isildur]: card.Playable.indexOf(Playable_e.scrol_of_isildur) > -1,
        [Playable_e.minor]: card.Playable.indexOf(Playable_e.minor) > -1,
        [Playable_e.major]: card.Playable.indexOf(Playable_e.major) > -1,
        [Playable_e.greater]: card.Playable.indexOf(Playable_e.greater) > -1,
        [Playable_e.palantiri]: card.Playable.indexOf(Playable_e.palantiri) > -1,
        [Playable_e.gold_ring]: card.Playable.indexOf(Playable_e.gold_ring) > -1,
        [Playable_e.information]: card.Playable.indexOf(Playable_e.information) > -1,
      };
    } else {
      return null;
    }
  }

  public string_between_strings(startStr: string, endStr: string, str: string) {
    const pos: number = str.indexOf(startStr) + startStr.length;
    return str.substring(pos, str.indexOf(endStr, pos));
  }

  public filterOfficial(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return (
        card.gccgSet === Set_e.TW ||
        card.gccgSet === Set_e.TD ||
        card.gccgSet === Set_e.DM ||
        card.gccgSet === Set_e.LE ||
        card.gccgSet === Set_e.AS ||
        card.gccgSet === Set_e.WH ||
        card.gccgSet === Set_e.BA
      );
    });
  }

  public getSiteIconName(card: Card_i): string {
    let siteName = card.Site ?? '';
    if (siteName === 'darkhold') {
      siteName = 'dark-hold';
    }
    return siteName.toLowerCase().replaceAll('&', 'and').replaceAll(' ', '-').replaceAll('\'', '-') ?? '';
  }

  public getImageUrl(card: Card_i): string {
    return 'https://cardnum.net/img/cards/' + card.set_code + '/' + card.ImageName;
  }

  public getSiteCreatureId(card: Card_i): string {
    let answer = '';
    if (card.text && card.text.indexOf('Automatic-attack') > -1) {
      if (card.text.indexOf(CreatureType_e.orcs) > -1) {
        answer = CreatureType_e.orcs;
      } else if (card.text.indexOf(CreatureType_e.spiders) > -1) {
        answer = CreatureType_e.spiders;
      } else if (card.text.indexOf(CreatureType_e.men) > -1) {
        answer = CreatureType_e.men;
      } else if (card.text.indexOf(CreatureType_e.dragon) > -1) {
        answer = CreatureType_e.dragon;
      } else if (card.text.indexOf(CreatureType_e.undead) > -1) {
        answer = CreatureType_e.undead;
      } else if (card.text.indexOf(CreatureType_e.pukel_creature) > -1) {
        answer = CreatureType_e.pukel_creature;
      } else if (card.text.indexOf(CreatureType_e.wolves) > -1) {
        answer = CreatureType_e.wolves;
      } else if (card.text.indexOf(CreatureType_e.troll) > -1) {
        answer = CreatureType_e.troll;
      } else if (card.text.indexOf(CreatureType_e.opponent_may_play) > -1) {
        answer = CreatureType_e.opponent_may_play;
      }
    }
    return answer.toLowerCase().replaceAll('û', 'u').replaceAll(' ', '-');
  }

  public getSvgId(card: Card_i): string {
    return '#' + card.normalizedtitle?.replaceAll(' ', '-').replaceAll('&', 'and').replaceAll('\'', '-')
  }

  public isRegionCardQueer(card: Card_i): boolean {
    let anwer = false;
    [
      'metw_angmar',
      'metw_forochel',
      'metw_cardolan',
      'metw_anfalas',
      'metw_lamedon',
      'metw_harondor',
      'metw_khand',
      'metw_greymountainnarrows',
      'metw_woodlandrealm',
      'metw_ironhills',
      'metw_ironhills',
      'metw_witheredheath',
      'metw_horseplains',
      'metw_gorgoroth',
      'metw_nurn',
      'metw_rohan',
      'metw_bayofbelfalas',
      'metw_dagorlad',
      'metw_hollin',
      'metw_northernrhovanion',
    ].forEach((cardId) => {
      cardId === card.id ? anwer = true : null;
    })
    return anwer;
  }
}
