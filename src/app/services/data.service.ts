import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e,
  CurrentGuiContext_2,
  CurrentGuiContext_3,
  ExtraMovement_e,
  PlayerId_e,
  SubAlignmentType_e,
} from '../interfaces/interfaces';
import {copyObject, findId, findIdAndDelete, getStringBetweenStrings, hasId} from './utility-methods';
import {AppService} from './app-service';
import {CardUtilService} from './card-util.service';
import {MapService} from './map-service';

@Injectable()
export class DataService {
  public all_cards: Card_i[] = [];
  public currentGuiContext_persistent: CurrentGuiContext_2 = {
    currentAlignment: AlignmentType_e.Hero,
    currentSubAlignment_1: SubAlignmentType_e.hero_default,
    currentSubAlignment_2: SubAlignmentType_e.hero_default,
    currentSiteOrRegion: null,
    underDeep: false,
    currentPlayer: PlayerId_e.player_1,
    otherPlayersGuiContext: null,
  }
  public currentGuiContext_notPersitent: CurrentGuiContext_3 = {
    currentReachableRegions: [],
    currentReachableSites: [],
    currentSitesOfRegion: [],
    currentJourneySiteFrom: null,
    currentJourneySiteTo: null,
    currentJourneyRegions: [],
    currentPlayableHazards: [],
    extraMovement: ExtraMovement_e.zero,
  }
  public $map: MapService | null = null;

  constructor(
    public $app: AppService,
    public $cardUtil: CardUtilService,
  ) {
    $cardUtil.$data = this;
    $app.$data = this;
    this.all_cards = this.$cardUtil.getAllCards();
    const savedGuiContext = sessionStorage.getItem('meccg-gui-context')
    if (savedGuiContext) {
      this.currentGuiContext_persistent = JSON.parse(savedGuiContext);
    }
  }

  public refreshCalculations() {
    const savedCurrentSiteOrRegion = this.currentGuiContext_persistent.currentSiteOrRegion;
    const savedCurrentJourneySiteFrom = this.currentGuiContext_notPersitent.currentJourneySiteFrom;
    const saveCurrentJourneySiteTo = this.currentGuiContext_notPersitent.currentJourneySiteTo;
    this.resetCurrentGuiContext();
    const allSites = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, true));
    if (savedCurrentSiteOrRegion) {
      const newCurrentSiteOrRegion = findId(allSites, savedCurrentSiteOrRegion.normalizedtitle, false, 'normalizedtitle');
      if (newCurrentSiteOrRegion) {
        this.onSiteOrRegionClick(newCurrentSiteOrRegion, true);
        if (savedCurrentJourneySiteFrom) {
          this.startJourney(true);
          if (saveCurrentJourneySiteTo) {
            const newCurrentJournesSiteTo = findId(this.currentGuiContext_notPersitent.currentReachableSites, saveCurrentJourneySiteTo.normalizedtitle, false, 'normalizedtitle');
            if (newCurrentJournesSiteTo) {
              this.onSiteOrRegionClick(newCurrentJournesSiteTo, true);
            }
          }
        }
      }
    }
    this.$map?.renderMapContent();
    this.saveCurrentStates();
  }

  public resetCurrentGuiContext() {
    this.currentGuiContext_persistent.currentSiteOrRegion = null;
    // this.curent.currentReachableRegions = [];
    // this.currentGuiContext_persistent.currentReachableSites = [];
    // this.currentGuiContext_persistent.currentSitesOfRegion = [];
    this.currentGuiContext_notPersitent.currentJourneySiteFrom = null;
    this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
    this.currentGuiContext_notPersitent.currentJourneyRegions = [];
    this.currentGuiContext_notPersitent.currentPlayableHazards = [];
  }

  public saveCurrentStates() {
    sessionStorage.setItem('meccg-gui-context', JSON.stringify(this.currentGuiContext_persistent));
  }

  public getSketchId(card: Card_i, noHash?: boolean): string {
    return (noHash ? '' : '#') + card.normalizedtitle?.replaceAll(' ', '-').replaceAll('&', 'and').replaceAll('\'', '-')
  }

  public calculateReachableRegionsAndSites(): void {
    if (this.currentGuiContext_persistent.currentSiteOrRegion) {
      const pushSitesOfRegion = (region: Card_i, routingRegions: Card_i[]) => {
        const sites: Card_i[] = this.getSitesOfRegion(region);
        sites.forEach((site) => {
          site.routingRegions = routingRegions;
          reachableSites.push(site);
        })
      };
      const startSite: Card_i = copyObject(this.currentGuiContext_persistent.currentSiteOrRegion);
      const regionLevel_1: Card_i | null = startSite.type === CardType_e.Site ? copyObject(this.getRegionOfSite(startSite)) : null;
      const reachableRegions: Card_i[] = [];
      const reachableSites: Card_i[] = [];
      if (regionLevel_1) {
        regionLevel_1.routingSteps = 1;
        reachableRegions.push(regionLevel_1);
        pushSitesOfRegion(regionLevel_1, [regionLevel_1]);
        regionLevel_1.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_1, regionLevel_1);
      }
      regionLevel_1?.suroundingRegions?.forEach((regionLevel_2) => {
        regionLevel_2.routingSteps = 2;
        reachableRegions.push(regionLevel_2);
        pushSitesOfRegion(regionLevel_2, [regionLevel_1, regionLevel_2]);
        regionLevel_2.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_2, regionLevel_1);
      });
      regionLevel_1?.suroundingRegions?.forEach((regionLevel_2) => {
        regionLevel_2?.suroundingRegions?.forEach((regionLevel_3) => {
          regionLevel_3.routingSteps = 3;
          reachableRegions.push(regionLevel_3);
          pushSitesOfRegion(regionLevel_3, [regionLevel_1, regionLevel_2, regionLevel_3]);
          regionLevel_3.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_3, regionLevel_1);
        });
      });
      regionLevel_1?.suroundingRegions?.forEach((regionLevel_2) => {
        regionLevel_2?.suroundingRegions?.forEach((regionLevel_3) => {
          regionLevel_3?.suroundingRegions?.forEach((regionLevel_4) => {
            regionLevel_4.routingSteps = 4;
            reachableRegions.push(regionLevel_4);
            pushSitesOfRegion(regionLevel_4, [regionLevel_1, regionLevel_2, regionLevel_3, regionLevel_4]);
            regionLevel_4.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_4, regionLevel_1);
          });
        });
      });
      if (this.currentGuiContext_notPersitent.extraMovement === ExtraMovement_e.one ||
        this.currentGuiContext_notPersitent.extraMovement === ExtraMovement_e.two) {
        regionLevel_1?.suroundingRegions?.forEach((regionLevel_2) => {
          regionLevel_2?.suroundingRegions?.forEach((regionLevel_3) => {
            regionLevel_3?.suroundingRegions?.forEach((regionLevel_4) => {
              regionLevel_4?.suroundingRegions?.forEach((regionLevel_5) => {
                regionLevel_5.routingSteps = 5;
                reachableRegions.push(regionLevel_5);
                pushSitesOfRegion(regionLevel_5, [regionLevel_1, regionLevel_2, regionLevel_3, regionLevel_4, regionLevel_5]);
                regionLevel_5.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_5, regionLevel_1);
              });
            });
          });
        });
      }
      if (this.currentGuiContext_notPersitent.extraMovement === ExtraMovement_e.two) {
        regionLevel_1?.suroundingRegions?.forEach((regionLevel_2) => {
          regionLevel_2?.suroundingRegions?.forEach((regionLevel_3) => {
            regionLevel_3?.suroundingRegions?.forEach((regionLevel_4) => {
              regionLevel_4?.suroundingRegions?.forEach((regionLevel_5) => {
                regionLevel_5?.suroundingRegions?.forEach((regionLevel_6) => {
                  regionLevel_6.routingSteps = 6;
                  reachableRegions.push(regionLevel_6);
                  pushSitesOfRegion(regionLevel_6, [regionLevel_1, regionLevel_2, regionLevel_3, regionLevel_4, regionLevel_5, regionLevel_6]);
                  regionLevel_6.suroundingRegions = this.getSurroundingRegionsWithoutRedundant(regionLevel_6, regionLevel_1);
                });
              });
            });
          });
        });
      }
      this.getReachableUnderDeepSites(startSite).forEach((card: Card_i) => {
        reachableSites.push(card);
      })
      if (startSite.normalizedtitle === 'the under-galleries') {
        reachableSites.push(findId(this.$cardUtil.filterSites(this.all_cards), 'cirith gorgor', false, 'normalizedtitle'));
      }
      if (hasId(reachableSites, startSite.id)) {
        findIdAndDelete(reachableSites, startSite.id);
      }
      this.getReachableHavensOfSite(startSite).forEach((card: Card_i) => {
        if (!hasId(reachableSites, card.id)) {
          reachableSites.push(card);
        }
      })
      if (startSite.Haven === startSite.title) {
        this.getReachableSitesOfHaven(startSite).forEach((card: Card_i) => {
          if (!hasId(reachableSites, card.id)) {
            reachableSites.push(card);
          }
        })
      }
      this.currentGuiContext_notPersitent.currentReachableRegions = reachableRegions;
      this.currentGuiContext_notPersitent.currentReachableSites = reachableSites;
    }
  }

  public getReachableHavensOfSite(card: Card_i): Card_i[] {
    const answer: Card_i[] = [];
    const all_Sites: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, false));
    const haven: Card_i | null = findId(all_Sites, card.Haven, false, 'title');
    if (haven) {
      answer.push(haven);
    }
    return answer;
  }

  public getReachableSitesOfHaven(card: Card_i): Card_i[] {
    const answer: Card_i[] = [];
    const all_Sites: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, false, undefined, true));
    all_Sites.forEach((site: Card_i) => {
      if (site.Haven === card.title) {
        answer.push(site);
      }
    })
    return answer;
  }

  public getReachableUnderDeepSites(card: Card_i): Card_i[] {
    const answer: Card_i[] = [];
    const allUnderdeepSites: Card_i[] = this.$cardUtil.filterUnderDeeps(this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, true, undefined, true)));
    allUnderdeepSites.forEach((underdeepCard) => {
      if (underdeepCard.text && underdeepCard.text.indexOf(card.title ?? '') > -1) {
        answer.push(underdeepCard);
      }
      if (card.normalizedtitle === 'cirith gorgor' && underdeepCard.normalizedtitle === 'the under-galleries') {
        answer.push(underdeepCard);
      }
      if (underdeepCard.normalizedtitle === 'ancient deep-hold' && card.normalizedtitle !== 'ancient deep-hold' && card.RPath === 'Under-deeps' && card.Site === 'Ruins & Lairs') {
        answer.push(underdeepCard);
      }
      if (card.normalizedtitle === 'ancient deep-hold' && underdeepCard.normalizedtitle !== 'ancient deep-hold' && underdeepCard.RPath === 'Under-deeps' && underdeepCard.Site === 'Ruins & Lairs') {
        answer.push(underdeepCard);
      }
    });
    if (this.$cardUtil.isUnderDeepSite(card)) {
      const allSites: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards));
      allSites.forEach((surfaceCard) => {
        if (card.text && card.text.indexOf(surfaceCard.title ?? '') > -1) {
          answer.push(surfaceCard);
        }
      });
    }
    return answer;
  }

  public getSurroundingRegionsWithoutRedundant(card_region: Card_i, firstRegionComplex?: Card_i): Card_i[] {
    const answer: Card_i[] = [];
    const all_regions: Card_i[] = copyObject(this.$cardUtil.filterOfficial(this.$cardUtil.filterRegions(this.all_cards)));
    all_regions.forEach((card: Card_i) => {
      if (card.text && card.text.indexOf(card_region.title ?? '') > -1) {
        if (card_region.title === 'Belfalas' && card.text.indexOf('Bay of Belfalas') > -1 && !(card.text.indexOf(', Belfalas') > -1)) {
          return;
        }
        const foundExistingRegion: Card_i | null = this.findExistingRegion(card.id ?? '', firstRegionComplex ?? null);
        if (!foundExistingRegion) {
          answer.push(card);
        }
      }
    });
    return answer;
  };

  public findExistingRegion(id: string, region_1: any): Card_i | null {
    let answer: Card_i | null = null;
    region_1?.id === id ? answer = region_1 : null;
    region_1?.suroundingRegions?.forEach((region_2: Card_i) => {
      region_2.id === id ? answer = region_2 : null;
      region_2.suroundingRegions?.forEach((region_3: Card_i) => {
        region_3.id === id ? answer = region_3 : null;
        region_3.suroundingRegions?.forEach((region_4: Card_i) => {
          region_4.id === id ? answer = region_4 : null;
        });
      });
    });
    return answer;
  }

  public getRegionOfSite(card_site: Card_i): Card_i | null {
    let answer: Card_i | null = null;
    if (card_site.type === CardType_e.Site && !this.$cardUtil.isUnderDeepSite(card_site)) {
      const regions: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterRegions(this.all_cards));
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
      const card_sites: Card_i[] = copyObject(this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, false, undefined, true)));
      card_sites.forEach((card_site: Card_i) => {
        if (card_region.title === card_site.Region) {
          answer.push(card_site);
        }
      });
    }
    return answer;
  };

  public onSiteOrRegionClick(card: Card_i, noRender?: boolean): void {
    if (this.currentGuiContext_notPersitent.currentJourneySiteFrom) {
      if (card.type === CardType_e.Site) {
        const clickedCard: Card_i = findId(this.currentGuiContext_notPersitent.currentReachableSites, card.id);
        this.currentGuiContext_notPersitent.currentJourneySiteTo = clickedCard as Card_i;
        if (this.currentGuiContext_notPersitent.currentJourneyRegions.length && this.currentGuiContext_notPersitent.currentJourneyRegions[this.currentGuiContext_notPersitent.currentJourneyRegions.length - 1].id === this.getRegionOfSite(card)?.id) {
        } else {
          this.currentGuiContext_notPersitent.currentJourneyRegions = clickedCard?.routingRegions ?? [];
        }
        if (
          this.currentGuiContext_notPersitent.currentJourneySiteFrom.Haven === this.currentGuiContext_notPersitent.currentJourneySiteTo.title
        ) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [];
          this.currentGuiContext_notPersitent.currentJourneySiteFrom.Path?.split(' ').forEach((key: string) => {
            const region: Card_i | null = this.$cardUtil.createNonRegionCard(key);
            region ? this.currentGuiContext_notPersitent.currentJourneyRegions.push(region) : null;
          })
        }
        if (
          this.currentGuiContext_notPersitent.currentJourneySiteTo.Haven === this.currentGuiContext_notPersitent.currentJourneySiteFrom.title
        ) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [];
          this.currentGuiContext_notPersitent.currentJourneySiteTo.Path?.split(' ').forEach((key: string) => {
            const region: Card_i | null = this.$cardUtil.createNonRegionCard(key);
            region ? this.currentGuiContext_notPersitent.currentJourneyRegions.push(region) : null;
          })
        }
        this.calculateCurrentPlayableHazards();
      } else if (card.type === CardType_e.Region) {
        const foundRegions: Card_i[] = this.getSurroundingRegionsWithoutRedundant(card);
        if (card.id === this.currentGuiContext_notPersitent.currentJourneyRegions[0]?.id) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [card];
        } else if (card.id === this.currentGuiContext_notPersitent.currentJourneyRegions[1]?.id) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], card];
        } else if (card.id === this.currentGuiContext_notPersitent.currentJourneyRegions[2]?.id) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], this.currentGuiContext_notPersitent.currentJourneyRegions[1], card];
        } else if (hasId(foundRegions, this.currentGuiContext_notPersitent.currentJourneyRegions[2]?.id)) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], this.currentGuiContext_notPersitent.currentJourneyRegions[1], this.currentGuiContext_notPersitent.currentJourneyRegions[2], card];
        } else if (hasId(foundRegions, this.currentGuiContext_notPersitent.currentJourneyRegions[1]?.id)) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], this.currentGuiContext_notPersitent.currentJourneyRegions[1], card];
        } else if (hasId(foundRegions, this.currentGuiContext_notPersitent.currentJourneyRegions[0]?.id)) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], card];
        }
        this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
      }
    } else {
      this.currentGuiContext_persistent.currentSiteOrRegion = card;
      if (card.type === CardType_e.Region) {
        this.currentGuiContext_notPersitent.currentSitesOfRegion = this.getSitesOfRegion(card);
      } else {
        this.currentGuiContext_notPersitent.currentSitesOfRegion = [];
      }
      this.calculateReachableRegionsAndSites();
    }
    this.saveCurrentStates();
    if (!noRender) {
      this.$map?.renderActivities();
    }
  }

  public calculateCurrentPlayableHazards() {
    const allHazardCards: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterHazards(this.all_cards));
    const filteredHazards: Card_i[] = allHazardCards.filter((card: Card_i) => {
      let answer = false;
      this.currentGuiContext_notPersitent.currentJourneyRegions.forEach((regionCard: Card_i) => {
        if (card.text && card.text?.toLowerCase().indexOf(regionCard.title?.toLowerCase() ?? '') > -1) {
          answer = true;
        }
      });
      if (card.text && card.text?.toLowerCase().indexOf(this.currentGuiContext_notPersitent.currentJourneySiteTo?.title?.toLowerCase() ?? '') > -1) {
        answer = true;
      }
      return answer
    })
    this.currentGuiContext_notPersitent.currentPlayableHazards = filteredHazards;
  }

  public startJourney(noRender?: boolean): void {
    if (this.currentGuiContext_persistent.currentSiteOrRegion?.type === CardType_e.Site) {
      this.currentGuiContext_notPersitent.currentJourneySiteFrom = copyObject(this.currentGuiContext_persistent.currentSiteOrRegion);
      this.saveCurrentStates();
      if (this.currentGuiContext_notPersitent.currentJourneySiteFrom) {
        const region = this.getRegionOfSite(this.currentGuiContext_notPersitent.currentJourneySiteFrom);
        if (region) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [region]
        }
      }
      if (!noRender) {
        this.$map?.renderActivities();
      }
    }
  }

  public endJourney(newSiteTarget?: Card_i): void {
    const newSite = newSiteTarget ?? this.currentGuiContext_notPersitent.currentJourneySiteTo;
    this.currentGuiContext_notPersitent.currentJourneySiteFrom = null;
    this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
    this.currentGuiContext_notPersitent.currentJourneyRegions = [];
    this.currentGuiContext_notPersitent.currentPlayableHazards = [];
    if (newSite) {
      this.onSiteOrRegionClick(newSite);
    }
    this.saveCurrentStates();
    this.$map?.renderActivities();
  }

  public getUnderdeepMoveNumbers(onlyFromThisCard?: Card_i, getAllExisting?: boolean, filterChallengeDecks?: boolean): {
    [key: string]: number
  } {
    const answer: { [key: string]: number } = {};
    const all_sites: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, true, getAllExisting ? AlignmentType_e.Balrog : undefined, filterChallengeDecks));
    const all_underdeepSites: Card_i[] = this.$cardUtil.filterUnderDeeps(this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, true, getAllExisting ? AlignmentType_e.Balrog : undefined, filterChallengeDecks)));
    if (!onlyFromThisCard || onlyFromThisCard.normalizedtitle === 'cirith gorgor' || onlyFromThisCard.normalizedtitle === 'the under-galleries') {
      if (getAllExisting || hasId(all_underdeepSites, 'the under-galleries', 'normalizedtitle'))
        answer['the-under-galleries_cirith-gorgor'] = 0;
    }
    if (hasId(all_underdeepSites, 'meba_ancientdeephold')) {
      if (!onlyFromThisCard || (onlyFromThisCard.RPath === 'Under-deeps' && onlyFromThisCard.Site === 'Ruins & Lairs')) {
        answer['x_ancient-deep-hold'] = 8;
      }
    }
    all_underdeepSites.forEach((underdeepSite: Card_i) => {
      const text = underdeepSite.text;
      if (text && text.indexOf('Adjacent Sites') > -1) {
        all_sites.forEach((site) => {
          if (site.title && underdeepSite.text && underdeepSite.text.indexOf(site.title) > -1) {
            const amount: any = getStringBetweenStrings(site.title + ' (', ')', underdeepSite.text);
            if (amount) {
              const key: string = this.getSketchId(underdeepSite, true) + '_' + this.getSketchId(site, true);
              if (key && onlyFromThisCard && key.indexOf(this.getSketchId(onlyFromThisCard, true)) < 0) {
                return;
              }
              answer[key] = parseInt(amount);
            }
          }
        })
      }
    });
    return answer;
  }
}
