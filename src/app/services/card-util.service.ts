import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e,
  CreatureType_e,
  LanguageId_e,
  Playable_e,
  Playables_i, RegionType_e,
  Set_e
} from '../interfaces/interfaces';
import {AppService} from './app-service';
import {DataService} from './data.service';
import {hasId} from './utility-methods';
import {challengeDecksSites} from '../../assets/data/challengeDecks';

declare var meccgCards: Card_i[] | undefined;

@Injectable()
export class CardUtilService {

  public $data: DataService | null = null;

  constructor(
    public $app: AppService,
  ) {

  }

  public getAllCards(): Card_i[] {
    const answer: Card_i[] = [];
    if (meccgCards?.length) {
      meccgCards.forEach((card: Card_i) => {
        answer.push({
          'title-gr': card['title-gr'],
          Hoard: card.Hoard,
          ImageName: card.ImageName,
          RPath: card.RPath,
          Region: card.Region,
          alignment: card.alignment,
          gccgSet: card.gccgSet,
          normalizedtitle: card.normalizedtitle,
          set_code: card.set_code,
          text: card.text,
          title: card.title,
          type: card.type,
          Site: card.Site,
          id: this.createCardId(card),
        });
      });
      answer.forEach((card: Card_i) => {
        if (card.RPath === 'Boarder-land') {
          card.RPath = RegionType_e['Border-land'];
        }
        if (card.RPath === 'The Under-gates') {
          card.RPath = RegionType_e['Under-deeps'];
        }
        if (card.normalizedtitle === 'the rusted-deeps') {
          card.text = card.text?.replace('Iron Hill Dwarf-hold(13)', 'Iron Hill Dwarf-hold (13)')
        }
        if (card.normalizedtitle === 'the drowning-deeps') {
          card.text = card.text?.replace('Blue-mountain Dwarf-hold', 'Blue Mountain Dwarf-hold')
        }
        if (card.normalizedtitle === 'remains of thangorodrim') {
          card.text = card.text?.replace('the Drowning-deeps', 'The Drowning-deeps')
        }
        if (card.normalizedtitle === 'the under-gates') {
          card.text = card.text?.replace('the Under-grottos', 'The Under-grottos')
        }
        if (card.normalizedtitle === 'old pukel-land') {
          card.text = card.text?.replace('Eridaoran Coast', 'Eriadoran Coast')
        }
        if (card.normalizedtitle === 'northern rhovanion') {
          card.text = card.text + ', Southern Rhovanion';
        }
        if (card.normalizedtitle === 'anfalas') {
          card.text = card.text?.replace('Old Pûkel-land', 'Old Pûkel Gap')
        }
      });
    }
    return answer;
  }

  public createCardId(card: Card_i): string {
    return card.ImageName?.replaceAll('.jpg', '') ?? '';
  }

  public filterSites(cards: Card_i[], withUnderDeeps?: boolean, alignment?: AlignmentType_e): Card_i[] {
    let relevantAlignment: AlignmentType_e = this.$data?.currentGuiContext_persistent.currentAlignment ?? AlignmentType_e.Hero;
    if (alignment) {
      relevantAlignment = alignment;
    }
    let currentAlignment: AlignmentType_e = relevantAlignment;
    if (currentAlignment.indexOf('Challenge') > -1) {
      currentAlignment = AlignmentType_e.Hero;
      if (relevantAlignment === AlignmentType_e.Challenge_Deck_V) {
        currentAlignment = AlignmentType_e.Balrog;
      }
    }
    if (currentAlignment === AlignmentType_e['Fallen-wizard_bright'] || currentAlignment === AlignmentType_e['Fallen-wizard_dark']) {
      currentAlignment = AlignmentType_e['Fallen-wizard'];
    }
    const allSiteCards: Card_i[] = cards?.filter((card: Card_i) => {
      return card.type === CardType_e.Site;
    });
    let answer = allSiteCards?.filter((card: Card_i) => {
      return card.alignment === currentAlignment;
    });
    if (currentAlignment === AlignmentType_e.Balrog) {
      allSiteCards.forEach((card: Card_i) => {
        if (card.alignment === AlignmentType_e.Minion && !hasId(answer, card.normalizedtitle, 'normalizedtitle')) {
          answer?.push(card);
        }
      });
    }
    if (relevantAlignment === AlignmentType_e['Fallen-wizard_dark']) {
      allSiteCards.forEach((card: Card_i) => {
        if (card.alignment === AlignmentType_e.Minion && !hasId(answer, card.normalizedtitle, 'normalizedtitle')) {
          answer?.push(card);
        }
      });
    }
    if (relevantAlignment === AlignmentType_e['Fallen-wizard_bright']) {
      allSiteCards.forEach((card: Card_i) => {
        if (card.alignment === AlignmentType_e.Hero && !hasId(answer, card.normalizedtitle, 'normalizedtitle')) {
          answer?.push(card);
        }
      });
    }
    if (relevantAlignment.indexOf('Challenge') > -1) {
      answer = answer?.filter((card: Card_i) => {
        return challengeDecksSites[relevantAlignment].indexOf(card.normalizedtitle ?? '') > -1;
      });
    }
    if (!withUnderDeeps) {
      answer = answer?.filter((card: Card_i) => {
        return card.RPath !== 'Under-deeps';
      });
    }
    return answer;
  }

  public isUnderDeepSite(card: Card_i): boolean {
    return card.RPath === 'Under-deeps';
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

  public filterUnderDeeps(cards: Card_i[]): Card_i[] {
    return cards?.filter((card) => {
      return this.isUnderDeepSite(card);
    });
  }

  public getPlayablesOfCard(card: Card_i): Playables_i | null {

    const creatureId = this.getCreatureId(card);
    if (card.Playable) {
      return {
        [Playable_e.scrol_of_isildur]: card.Playable.indexOf(Playable_e.scrol_of_isildur) > -1,
        [Playable_e.minor]: card.Playable.indexOf(Playable_e.minor) > -1,
        [Playable_e.major]: card.Playable.indexOf(Playable_e.major) > -1,
        [Playable_e.greater]: card.Playable.indexOf(Playable_e.greater) > -1,
        [Playable_e.palantiri]: card.Playable.indexOf(Playable_e.palantiri) > -1,
        [Playable_e.gold_ring]: card.Playable.indexOf(Playable_e.gold_ring) > -1,
        [Playable_e.information]: card.Playable.indexOf(Playable_e.information) > -1,
        [Playable_e.dragonHoard]: creatureId === 'dragon' || card.normalizedtitle === 'framsburg',
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
      } else if (card.text.indexOf(CreatureType_e.drake) > -1) {
        answer = CreatureType_e.drake;
      } else if (card.text.indexOf(CreatureType_e.drake) > -1) {
        answer = CreatureType_e.drake;
      } else if (card.text.indexOf(CreatureType_e.dwarves) > -1) {
        answer = CreatureType_e.dwarves;
      } else if (card.text.indexOf(CreatureType_e.elves) > -1) {
        answer = CreatureType_e.elves;
      } else if (card.normalizedtitle === 'eagles\' eyrie') {
        answer = CreatureType_e.eagle;
      } else if (card.text.indexOf(CreatureType_e.maia) > -1) {
        answer = CreatureType_e.maia;
      } else if (card.text.indexOf('Dúnedain') > -1) {
        answer = CreatureType_e.dunedain;
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
