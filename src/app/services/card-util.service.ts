import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e,
  CreatureType_e,
  LanguageId_e,
  Playable_e,
  Playables_i,
  Set_e
} from '../interfaces/interfaces';
import {AppService} from './app-service';
import {DataService} from './data.service';


@Injectable()
export class CardUtilService {

  public $data: DataService | null = null;

  constructor(
    public $app: AppService,
  ) {

  }

  public createCardId(card: Card_i): string {
    return card.ImageName?.replaceAll('.jpg', '') ?? '';
  }

  public filterSites(cards: Card_i[]): Card_i[] {
    let answer = cards?.filter((card) => {
      return card.type === CardType_e.Site;
    });
    answer = answer?.filter((card) => {
      return card.alignment === this.$data?.currentGuiContext.currentAlignment;
    });
    return answer;
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

  public filterHazards(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return card.type === CardType_e.Hazard;
    });
  }

  public getPlayablesOfCard(card: Card_i): Playables_i | null {
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

  public getCardImageUrl(card: Card_i): string {
    return 'https://cardnum.net/img/cards/' + card.set_code + '/' + card.ImageName;
  }

  public getCreatureId(card: Card_i): string {
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
      'metw_woldfoothills',
      'metw_oldpukelland',
      'metw_enedhwaith',
      'metw_dunland',
      'metw_southernmirkwood',
      'metw_brownlands',
      'metw_gundabad',
    ].forEach((cardId) => {
      cardId === card.id ? anwer = true : null;
    })
    return anwer;
  }

  public getSiteIconUrl(card: Card_i, whithShadow?: boolean): string {
    return `assets/img/site/${this.getSiteIconName(card) + (whithShadow ? '_shadow' : '')}.svg`;
  }

  public getCreatureIconUrl(card: Card_i): string {
    return `assets/img/creature/${this.getCreatureId(card)}.svg`;
  }

  public getRegionIconUrl(card: Card_i): string {
    return `assets/img/region/${card.RPath?.toLowerCase().replaceAll(' ', '-')}.svg`;
  }

  public getRegionPathId(card: Card_i): string {
    return `regionPathId_` + card.id;
  }

  public getRegionLabelId(card: Card_i): string {
    return `regionLabelId_` + card.id;
  }

  public getSiteLabelId(card: Card_i): string {
    return `siteLabelId_` + card.id;
  }

  public getCardTitle(card: Card_i): string {
    let answer = card.title ?? '';
    if (this.$app.getCurrentAppLanguage() === LanguageId_e.de) {
      answer = card['title-gr'] ?? '';
    }
    return answer;
  }

}
