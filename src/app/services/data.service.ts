import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e,
  CreatureType_e,
  CurrentGuiContext,
  LanguageId_e,
  Playable_e,
  Playables_i,
  RegionType_e,
  SelectItem,
  Set_e
} from '../interfaces/interfaces';
import {copyObject, findId, hasId} from './utility-methods';
import {AppService} from './app-service';

declare var meccgCards: Card_i[] | undefined;

@Injectable()
export class DataService {
  public cards: Card_i[] = [];
  public mapIsDradding: boolean = false;
  public zoomCard: Card_i | null = null;
  public openSiteSelectionModal: boolean = false;
  public openHazardCardsModal: boolean = false;
  public openModalReversed: boolean = false;
  public openMainMenuModal: boolean = false;

  public currentGuiContext: CurrentGuiContext = {
    currentAlignment: AlignmentType_e.Hero,
    currentSiteOrRegion: null,
    currentReachableRegions: [],
    currentReachableSites: [],
  }
  public currentSiteFrom: Card_i | null = null;
  public currentSiteTo: Card_i | null = null;
  public currentRouteRegions: Card_i[] = [];
  public currentPlayableHazards: Card_i[] = [];

  constructor(public $app: AppService) {
    // @ts-ignore
    document['onSiteOrRegionClick'] = (card: Card_i, event?: any) => {
      if (card && !this.mapIsDradding) {
        this.onSiteOrRegionClick(card);
      }
    }
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

  public refreshContentOnMap() {
  }

  public refreshRouteOnMap() {
  }

  public focusOnMap(focusItems: Card_i[]) {
  }

  public refreshMapContent() {
  }

  public createCardId(card: Card_i): string {
    return card.ImageName?.replaceAll('.jpg', '') ?? '';
  }

  public saveCurrentStates() {
    sessionStorage.setItem('meccg-gui-context', JSON.stringify(this.currentGuiContext));
  }

  public filterSites(cards: Card_i[]): Card_i[] {
    let answer = cards?.filter((card) => {
      return card.type === CardType_e.Site;
    });
    answer = answer?.filter((card) => {
      return card.alignment === this.currentGuiContext.currentAlignment;
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

  public calculateReachableRegionsAndSites(): void {
    if (this.currentGuiContext.currentSiteOrRegion) {
      const startSite: Card_i = copyObject(this.currentGuiContext.currentSiteOrRegion);
      const regionLevel_1: Card_i | null = startSite.type === CardType_e.Site ? copyObject(this.getRegionOfSite(startSite)) : null;
      const reachableRegions: Card_i[] = [];
      const reachableSites: Card_i[] = [];
      if (regionLevel_1) {
        regionLevel_1.routingSteps = 1;
        reachableRegions.push(regionLevel_1);
        const sites: Card_i[] = this.getSitesOfRegion(regionLevel_1);
        sites.forEach((site) => {
          site.routingRegions = [regionLevel_1];
          reachableSites.push(site);
        })
        regionLevel_1.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_1, regionLevel_1, 1);
        regionLevel_1.suroundingRegions.forEach((regionLevel_2) => {
          regionLevel_2.routingSteps = 2;
          reachableRegions.push(regionLevel_2);
          const sites: Card_i[] = this.getSitesOfRegion(regionLevel_2);
          sites.forEach((site) => {
            site.routingRegions = [regionLevel_1, regionLevel_2];
            reachableSites.push(site);
          })
          regionLevel_2.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_2, regionLevel_1, 2);
          regionLevel_2.suroundingRegions.forEach((regionLevel_3) => {
            regionLevel_3.routingSteps = 3;
            reachableRegions.push(regionLevel_3);
            const sites: Card_i[] = this.getSitesOfRegion(regionLevel_3);
            sites.forEach((site) => {
              site.routingRegions = [regionLevel_1, regionLevel_2, regionLevel_3];
              reachableSites.push(site);
            })
            regionLevel_3.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_3, regionLevel_1, 3);
            regionLevel_3.suroundingRegions.forEach((regionLevel_4) => {
              regionLevel_4.routingSteps = 4;
              reachableRegions.push(regionLevel_4);
              const sites: Card_i[] = this.getSitesOfRegion(regionLevel_4);
              sites.forEach((site) => {
                site.routingRegions = [regionLevel_1, regionLevel_2, regionLevel_3, regionLevel_4];
                reachableSites.push(site);
              })
            });
          });
        });
        this.currentGuiContext.currentReachableRegions = reachableRegions;
        this.currentGuiContext.currentReachableSites = reachableSites;
      }
    }
  }

  public getSurroundingRegionsWithoutRedundant(card_region: Card_i, firstRegionComplex?: Card_i, level?: number): Card_i[] {
    const answer: Card_i[] = [];
    const availableRegions: Card_i[] = copyObject(this.filterOfficial(this.filterRegions(this.cards)));
    availableRegions.forEach((card) => {
      if (card.text && card.text.indexOf(card_region.title ?? '') > -1) {
        const foundExistingRegion: Card_i | null = this.findExistingRegion(card.id ?? '', firstRegionComplex ?? null);
        if (!foundExistingRegion) {
          answer.push(card);
        } else {
        }
      }
    })
    return answer;
  };

  public findExistingRegion(id: string, region_1: any): Card_i | null {
    let answer: Card_i | null = null;
    if (region_1?.id === id) {
      answer = region_1;
    }
    region_1?.suroundingRegions?.forEach((region_2: Card_i) => {
      if (region_2.id === id) {
        answer = region_2;
      }
      region_2.suroundingRegions?.forEach((region_3: Card_i) => {
        if (region_3.id === id) {
          answer = region_3;
        }
        region_3.suroundingRegions?.forEach((region_4: Card_i) => {
          if (region_4.id === id) {
            answer = region_4;
          }
        });
      });
    });
    return answer;
  }

  public getRegionOfSite(card_site: Card_i): Card_i | null {
    let answer: Card_i | null = null;
    if (card_site.type === CardType_e.Site) {
      const regions: Card_i[] = this.filterOfficial(this.filterRegions(this.cards));
      regions.forEach((card_region: Card_i) => {
        if (card_region.title === card_site.Region) {
          answer = card_region;
        }
      });
    }
    return answer;
  };

  public getSitesOfRegion(card_region: Card_i): Card_i[] {
    let answer: Card_i[] = [];
    if (card_region.type === CardType_e.Region) {
      const card_sites: Card_i[] = this.filterOfficial(this.filterSites(this.filterAlignmentHero(this.cards)));
      card_sites.forEach((card_site: Card_i) => {
        if (card_region.title === card_site.Region) {
          answer.push(card_site);
        }
      });
    }
    return answer;
  };

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

  public onSiteOrRegionClick(card: Card_i): void {
    if (this.currentSiteFrom) {
      if (card.type === CardType_e.Site) {
        const foundCard = findId(this.currentGuiContext.currentReachableSites, card.id);
        this.currentSiteTo = foundCard as Card_i;
        if (!hasId(this.currentRouteRegions, this.getRegionOfSite(card)?.id)) {
          this.currentRouteRegions = foundCard.routingRegions ?? [];
        }
        this.calculateCurrentPlayableHazards();
      } else if (card.type === CardType_e.Region) {
        if (card.id === this.currentRouteRegions[0]?.id) {
          this.currentRouteRegions = [this.currentRouteRegions[0]];
          this.currentSiteTo = null;
        }
        const foundRegions: Card_i[] = this.getSurroundingRegionsWithoutRedundant(card);
        if (hasId(foundRegions, this.currentRouteRegions[0]?.id)) {
          this.currentRouteRegions = [this.currentRouteRegions[0], card];
          this.currentSiteTo = null;
        } else if (hasId(foundRegions, this.currentRouteRegions[1]?.id)) {
          this.currentRouteRegions = [this.currentRouteRegions[0], this.currentRouteRegions[1], card];
          this.currentSiteTo = null;
        } else if (hasId(foundRegions, this.currentRouteRegions[2]?.id)) {
          this.currentRouteRegions = [this.currentRouteRegions[0], this.currentRouteRegions[1], this.currentRouteRegions[2], card];
          this.currentSiteTo = null;
        }
      }
    } else {
      this.currentGuiContext.currentSiteOrRegion = card;
      this.calculateReachableRegionsAndSites();
    }
    this.saveCurrentStates();
    this.refreshRouteOnMap();
  }

  public calculateCurrentPlayableHazards() {
    const allHazardCards: Card_i[] = this.filterOfficial(this.filterHazards(this.cards));
    const filteredHazards: Card_i[] = allHazardCards.filter((card: Card_i) => {
      let answer = false;
      if (card.text && (card.text?.toLowerCase().indexOf('playable') > -1 || card.text?.toLowerCase().indexOf('played') > -1)) {
        this.currentRouteRegions.forEach((regionCard: Card_i) => {
          if (card.text && card.text?.indexOf(regionCard.title ?? '') > -1) {
            answer = true;
          }
        });
      }
      return answer
    })
    this.currentPlayableHazards = filteredHazards;
  }

  public startJourney(): void {
    if (this.currentGuiContext.currentSiteOrRegion?.type === CardType_e.Site) {
      this.currentSiteFrom = copyObject(this.currentGuiContext.currentSiteOrRegion);
      this.saveCurrentStates();
      this.refreshContentOnMap();
      if (this.currentSiteFrom) {
        const region = this.getRegionOfSite(this.currentSiteFrom);
        if (region) {
          this.currentRouteRegions = [region]
          this.refreshRouteOnMap();
        }
      }
    }
  }

  public endJourney(): void {
    this.currentSiteFrom = null;
    this.currentSiteTo = null;
    this.currentRouteRegions = [];
    this.currentPlayableHazards = [];
    this.saveCurrentStates();
    this.refreshContentOnMap();
    this.refreshRouteOnMap();
  }

  public getCardTitle(card: Card_i): string {
    let answer = card.title ?? '';
    if (this.$app.getCurrentAppLanguage() === LanguageId_e.de) {
      answer = card['title-gr'] ?? '';
    }
    return answer;
  }
}
