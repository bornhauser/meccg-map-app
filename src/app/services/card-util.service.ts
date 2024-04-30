import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e,
  CreatureType_e,
  LanguageId_e,
  Playable_e,
  Playables_i,
  RegionType_e,
  Set_e, SiteType_e,
  SubAlignmentType_e
} from '../interfaces/interfaces';
import {AppService} from './app-service';
import {DataService} from './data.service';
import {getStringBetweenStrings, hasId} from './utility-methods';
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
          Path: card.Path,
          Region: card.Region,
          Haven: card.Haven,
          alignment: card.alignment,
          gccgSet: card.gccgSet,
          normalizedtitle: card.normalizedtitle,
          set_code: card.set_code,
          text: card.text,
          title: card.title,
          type: card.type,
          Site: card.Site,
          Playable: card.Playable,
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
        if (card.normalizedtitle === 'cirith gorgor') {
          card.Path = card.Path?.replace('d s w f b w', 'd d s w f b w')
        }
      });
    }
    return answer;
  }

  public createCardId(card: Card_i): string {
    return card.ImageName?.replaceAll('.jpg', '') ?? '';
  }

  public filterSites(withUnderDeeps?: boolean, alignment?: AlignmentType_e | null, filterChallengeDeck?: boolean, subAlignment?: SubAlignmentType_e): Card_i[] {
    if (!alignment) {
      alignment = this.$data?.currentGuiContext_persistent.currentAlignment ?? AlignmentType_e.Hero;
    }
    let basicAlignment: AlignmentType_e = this.getUsedBasicAlignment(alignment);
    const cards = this.$data?.all_cards ?? [];
    const allSiteCards: Card_i[] = cards?.filter((card: Card_i) => {
      return card.type === CardType_e.Site;
    });
    let answer = allSiteCards?.filter((card: Card_i) => {
      let cardAlignment: AlignmentType_e = basicAlignment;
      return card.alignment === cardAlignment;
    });
    if (basicAlignment === AlignmentType_e.Balrog) {
      allSiteCards.forEach((card: Card_i) => {
        if (card.alignment === AlignmentType_e.Minion && !hasId(answer, card.normalizedtitle, 'normalizedtitle')) {
          answer?.push(card);
        }
      });
    }
    if (basicAlignment === AlignmentType_e.Fallen_wizard) {
      const relevantSubAlignment: SubAlignmentType_e = subAlignment ?? SubAlignmentType_e.hero_fallen_wizard;
      if (relevantSubAlignment === SubAlignmentType_e.hero_default || relevantSubAlignment === SubAlignmentType_e.minion_default) {
        answer = [];
      }
      allSiteCards.forEach((card: Card_i) => {
        if (relevantSubAlignment === SubAlignmentType_e.hero_default || relevantSubAlignment === SubAlignmentType_e.hero_fallen_wizard) {
          if (card.alignment === AlignmentType_e.Hero && !hasId(answer, card.normalizedtitle, 'normalizedtitle')) {
            answer?.push(card);
          }
        }
        if (relevantSubAlignment === SubAlignmentType_e.minion_default) {
          if (card.alignment === AlignmentType_e.Minion && !hasId(answer, card.normalizedtitle, 'normalizedtitle')) {
            answer?.push(card);
          }
        }
        if (relevantSubAlignment === SubAlignmentType_e.minion_fallen_wizard) {
          if (((card.alignment === AlignmentType_e.Hero && (
              card.Site === SiteType_e.Dark_hold || card.Site === SiteType_e.Shadow_hold
            )) || (card.alignment === AlignmentType_e.Minion && (
              card.Site === SiteType_e.Free_hold || card.Site === SiteType_e.Border_hold || card.Site === SiteType_e.Ruins_and_Lairs
            ))
          ) && !hasId(answer, card.normalizedtitle, 'normalizedtitle')) {
            answer?.push(card);
          }
        }
      });
    }
    if (filterChallengeDeck && !this.isBasicAlignment(alignment)) {
      answer = answer?.filter((card: Card_i) => {
        return challengeDecksSites[this.$data?.currentGuiContext_persistent.currentAlignment ?? ''].indexOf(card.normalizedtitle ?? '') > -1;
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
    return (card.Site ?? '').toLowerCase().replaceAll('&', 'and').replaceAll(' ', '-').replaceAll('\'', '-') ?? '';
  }

  public getCardImageUrl(card: Card_i): string {
    return 'https://cardnum.net/img/cards/' + card.set_code + '/' + card.ImageName;
  }

  public getCreatureId(card: Card_i): string {
    let answer = '';
    if (card.text && card.text.indexOf('Automatic-attack') > -1) {
      const text = getStringBetweenStrings('Automatic-attack', '"', card.text) ?? '';
      if (text.indexOf(CreatureType_e.orcs) > -1) {
        answer = CreatureType_e.orcs;
      } else if (text.indexOf(CreatureType_e.spiders) > -1) {
        answer = CreatureType_e.spiders;
      } else if (text.indexOf(CreatureType_e.men) > -1) {
        answer = CreatureType_e.men;
      } else if (text.indexOf(CreatureType_e.dragon) > -1) {
        answer = CreatureType_e.dragon;
      } else if (text.indexOf(CreatureType_e.undead) > -1) {
        answer = CreatureType_e.undead;
      } else if (text.indexOf(CreatureType_e.pukel_creature) > -1) {
        answer = CreatureType_e.pukel_creature;
      } else if (text.indexOf(CreatureType_e.wolves) > -1) {
        answer = CreatureType_e.wolves;
      } else if (text.indexOf(CreatureType_e.troll) > -1) {
        answer = CreatureType_e.troll;
      } else if (text.indexOf(CreatureType_e.opponent_may_play) > -1) {
        answer = CreatureType_e.opponent_may_play;
      } else if (text.indexOf(CreatureType_e.drake) > -1) {
        answer = CreatureType_e.drake;
      } else if (text.indexOf(CreatureType_e.drake) > -1) {
        answer = CreatureType_e.drake;
      } else if (text.indexOf(CreatureType_e.dwarves) > -1) {
        answer = CreatureType_e.dwarves;
      } else if (text.indexOf(CreatureType_e.elves) > -1) {
        answer = CreatureType_e.elves;
      } else if (card.normalizedtitle === 'eagles\' eyrie') {
        answer = CreatureType_e.eagle;
      } else if (text.indexOf(CreatureType_e.maia) > -1) {
        answer = CreatureType_e.maia;
      } else if (text.indexOf('Dúnedain') > -1) {
        answer = CreatureType_e.dunedain;
      } else if (text.indexOf('Awakened Plant') > -1) {
        answer = CreatureType_e.ent;
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
    return `siteLabelId_` + card.normalizedtitle?.replaceAll(' ', '').replaceAll('\'', '');
  }

  public getCardTitle(card: Card_i): string {
    let answer = card.title ?? '';
    if (this.$app.getCurrentAppLanguage() === LanguageId_e.de) {
      answer = card['title-gr'] ?? '';
    }
    return answer;
  }

  public createNonRegionCard(key: string): Card_i | null {
    let type: RegionType_e | null = null;
    if (key === 'c') {
      type = RegionType_e['Coastal Sea']
    }
    if (key === 's') {
      type = RegionType_e['Shadow_land']
    }
    if (key === 'w') {
      type = RegionType_e['Wilderness']
    }
    if (key === 'd') {
      type = RegionType_e['Dark-domain']
    }
    if (key === 'b') {
      type = RegionType_e['Border-land']
    }
    if (key === 'f') {
      type = RegionType_e['Free-domain']
    }
    if (type) {
      return {
        title: '...',
        'title-gr': '...',
        RPath: type,
        text: '...',
        type: CardType_e.Region,
        id: 'xxx',
      }
    } else {
      return null;
    }
  }

  public getUsedBasicAlignment(alignmentType?: AlignmentType_e): AlignmentType_e {
    if (!alignmentType) {
      alignmentType = this.$data?.currentGuiContext_persistent.currentAlignment ?? AlignmentType_e.Hero;
    }
    if (
      alignmentType === AlignmentType_e.Challenge_Deck_A ||
      alignmentType === AlignmentType_e.Challenge_Deck_B ||
      alignmentType === AlignmentType_e.Challenge_Deck_C ||
      alignmentType === AlignmentType_e.Challenge_Deck_D ||
      alignmentType === AlignmentType_e.Challenge_Deck_E
    ) {
      return AlignmentType_e.Hero;
    } else if (
      alignmentType === AlignmentType_e.Challenge_Deck_F ||
      alignmentType === AlignmentType_e.Challenge_Deck_G ||
      alignmentType === AlignmentType_e.Challenge_Deck_H ||
      alignmentType === AlignmentType_e.Challenge_Deck_I ||
      alignmentType === AlignmentType_e.Challenge_Deck_J ||
      alignmentType === AlignmentType_e.Challenge_Deck_K ||
      alignmentType === AlignmentType_e.Challenge_Deck_L ||
      alignmentType === AlignmentType_e.Challenge_Deck_M ||
      alignmentType === AlignmentType_e.Challenge_Deck_N
    ) {
      return AlignmentType_e.Minion;
    } else if (
      alignmentType === AlignmentType_e.Challenge_Deck_O ||
      alignmentType === AlignmentType_e.Challenge_Deck_P ||
      alignmentType === AlignmentType_e.Challenge_Deck_Q ||
      alignmentType === AlignmentType_e.Challenge_Deck_R ||
      alignmentType === AlignmentType_e.Challenge_Deck_S
    ) {
      return AlignmentType_e.Fallen_wizard;
    } else if (
      alignmentType === AlignmentType_e.Challenge_Deck_T
    ) {
      return AlignmentType_e.Hero;
    } else if (
      alignmentType === AlignmentType_e.Challenge_Deck_U
    ) {
      return AlignmentType_e.Minion;
    } else if (
      alignmentType === AlignmentType_e.Challenge_Deck_V
    ) {
      return AlignmentType_e.Balrog;
    } else {
      return alignmentType;
    }
  }

  public isBasicAlignment(alignmentType: AlignmentType_e): boolean {
    return (
      alignmentType === AlignmentType_e.Minion ||
      alignmentType === AlignmentType_e.Hero ||
      alignmentType === AlignmentType_e.Fallen_wizard ||
      alignmentType === AlignmentType_e.Balrog
    )
  }

}
