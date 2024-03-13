import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e,
  CurrentGuiContext_1,
  CurrentGuiContext_2,
  RegionType_e,
} from '../interfaces/interfaces';
import {copyObject, findId, findIdAndDelete, getStringBetweenStrings, hasId} from './utility-methods';
import {AppService} from './app-service';
import {CardUtilService} from './card-util.service';
import {MapService} from './map-service';

declare var meccgCards: Card_i[] | undefined;

@Injectable()
export class DataService {
  public all_cards: Card_i[] = [];
  public currentGuiContext_persistent: CurrentGuiContext_1 = {
    currentAlignment: AlignmentType_e.Hero,
    currentSiteOrRegion: null,
    currentReachableRegions: [],
    currentReachableSites: [],
    currentSitesOfRegion: [],
    underDeep: false,
  }
  public currentGuiContext_notPersitent: CurrentGuiContext_2 = {
    currentJourneySiteFrom: null,
    currentJourneySiteTo: null,
    currentJourneyRegions: [],
    currentPlayableHazards: [],
  }
  public $map: MapService | null = null;

  constructor(
    public $app: AppService,
    public $cardUtil: CardUtilService,
  ) {
    $cardUtil.$data = this;
    $app.$data = this;
    if (meccgCards?.length) {
      meccgCards.forEach((card) => {
        card.id = this.$cardUtil.createCardId(card);
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
      });
      this.all_cards = meccgCards;
      const savedGuiContext = sessionStorage.getItem('meccg-gui-context')
      if (savedGuiContext) {
        this.currentGuiContext_persistent = JSON.parse(savedGuiContext);
      }
    }
  }

  public resetCurrentGuiContext() {
    this.currentGuiContext_persistent.currentSiteOrRegion = null;
    this.currentGuiContext_persistent.currentReachableRegions = [];
    this.currentGuiContext_persistent.currentReachableSites = [];
    this.currentGuiContext_persistent.currentSitesOfRegion = [];
    this.currentGuiContext_notPersitent.currentJourneySiteFrom = null;
    this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
    this.currentGuiContext_notPersitent.currentJourneyRegions = [];
    this.currentGuiContext_notPersitent.currentPlayableHazards = [];
    this.$map?.renderActivities();
  }

  public saveCurrentStates() {
    sessionStorage.setItem('meccg-gui-context', JSON.stringify(this.currentGuiContext_persistent));
  }

  public getSketchId(card: Card_i, noHash?: boolean): string {
    return (noHash ? '' : '#') + card.normalizedtitle?.replaceAll(' ', '-').replaceAll('&', 'and').replaceAll('\'', '-')
  }

  public calculateReachableRegionsAndSites(): void {
    if (this.currentGuiContext_persistent.currentSiteOrRegion) {
      const startSite: Card_i = copyObject(this.currentGuiContext_persistent.currentSiteOrRegion);
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
      }
      this.getReachableUnderDeepSites(startSite).forEach((card) => {
        reachableSites.push(card);
      })
      if (startSite.normalizedtitle === 'the under-galleries') {
        reachableSites.push(findId(this.$cardUtil.filterSites(this.all_cards), 'cirith gorgor', false, 'normalizedtitle'));
      }
      if (hasId(reachableSites, startSite.id)) {
        findIdAndDelete(reachableSites, startSite.id);
      }
      this.currentGuiContext_persistent.currentReachableRegions = reachableRegions;
      this.currentGuiContext_persistent.currentReachableSites = reachableSites;
    }
  }

  public getReachableUnderDeepSites(card: Card_i): Card_i[] {
    const answer: Card_i[] = [];
    const allUnderdeepSites: Card_i[] = this.$cardUtil.filterUnderDeeps(this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, true)));
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

  public getSurroundingRegionsWithoutRedundant(card_region: Card_i, firstRegionComplex?: Card_i, level?: number): Card_i[] {
    const answer: Card_i[] = [];
    const availableRegions: Card_i[] = copyObject(this.$cardUtil.filterOfficial(this.$cardUtil.filterRegions(this.all_cards)));
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
      const card_sites: Card_i[] = copyObject(this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards)));
      card_sites.forEach((card_site: Card_i) => {
        if (card_region.title === card_site.Region) {
          answer.push(card_site);
        }
      });
    }
    return answer;
  };

  public onSiteOrRegionClick(card: Card_i): void {
    if (this.currentGuiContext_notPersitent.currentJourneySiteFrom) {
      if (card.type === CardType_e.Site) {
        const clickedCard: Card_i = findId(this.currentGuiContext_persistent.currentReachableSites, card.id);
        this.currentGuiContext_notPersitent.currentJourneySiteTo = clickedCard as Card_i;
        if (!hasId(this.currentGuiContext_notPersitent.currentJourneyRegions, this.getRegionOfSite(card)?.id)) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = clickedCard?.routingRegions ?? [];
        }
        this.calculateCurrentPlayableHazards();
      } else if (card.type === CardType_e.Region) {
        if (card.id === this.currentGuiContext_notPersitent.currentJourneyRegions[0]?.id) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0]];
          this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
        }
        const foundRegions: Card_i[] = this.getSurroundingRegionsWithoutRedundant(card);
        if (hasId(foundRegions, this.currentGuiContext_notPersitent.currentJourneyRegions[0]?.id)) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], card];
          this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
        } else if (hasId(foundRegions, this.currentGuiContext_notPersitent.currentJourneyRegions[1]?.id)) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], this.currentGuiContext_notPersitent.currentJourneyRegions[1], card];
          this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
        } else if (hasId(foundRegions, this.currentGuiContext_notPersitent.currentJourneyRegions[2]?.id)) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [this.currentGuiContext_notPersitent.currentJourneyRegions[0], this.currentGuiContext_notPersitent.currentJourneyRegions[1], this.currentGuiContext_notPersitent.currentJourneyRegions[2], card];
          this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
        }
      }
    } else {
      this.currentGuiContext_persistent.currentSiteOrRegion = card;
      if (card.type === CardType_e.Region) {
        this.currentGuiContext_persistent.currentSitesOfRegion = this.getSitesOfRegion(card);
      } else {
        this.currentGuiContext_persistent.currentSitesOfRegion = [];
      }
      this.calculateReachableRegionsAndSites();
    }
    this.saveCurrentStates();
    this.$map?.renderActivities();
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

  public startJourney(): void {
    if (this.currentGuiContext_persistent.currentSiteOrRegion?.type === CardType_e.Site) {
      this.currentGuiContext_notPersitent.currentJourneySiteFrom = copyObject(this.currentGuiContext_persistent.currentSiteOrRegion);
      this.saveCurrentStates();
      if (this.currentGuiContext_notPersitent.currentJourneySiteFrom) {
        const region = this.getRegionOfSite(this.currentGuiContext_notPersitent.currentJourneySiteFrom);
        if (region) {
          this.currentGuiContext_notPersitent.currentJourneyRegions = [region]
        }
      }
      this.$map?.renderActivities();
    }
  }

  public endJourney(): void {
    this.currentGuiContext_notPersitent.currentJourneySiteFrom = null;
    this.currentGuiContext_notPersitent.currentJourneySiteTo = null;
    this.currentGuiContext_notPersitent.currentJourneyRegions = [];
    this.currentGuiContext_notPersitent.currentPlayableHazards = [];
    this.saveCurrentStates();
    this.$map?.renderActivities();
  }

  public getUnderdeepMoveNumbers(onlyFromThisCard?: Card_i, getAllExisting?: boolean): { [key: string]: number } {
    const answer: { [key: string]: number } = {};
    if (!onlyFromThisCard || onlyFromThisCard.normalizedtitle === 'cirith gorgor' || onlyFromThisCard.normalizedtitle === 'the under-galleries') {
      answer['the-under-galleries_cirith-gorgor'] = 0;
    }
    if (this.currentGuiContext_persistent.currentAlignment === AlignmentType_e.Balrog || getAllExisting) {
      if (!onlyFromThisCard || (onlyFromThisCard.RPath === 'Under-deeps' && onlyFromThisCard.Site === 'Ruins & Lairs')) {
        answer['x_ancient-deep-hold'] = 8;
      }
    }
    const all_sites: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, true, getAllExisting ? AlignmentType_e.Balrog : undefined));
    const all_underdeepSites: Card_i[] = this.$cardUtil.filterUnderDeeps(this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards, true, getAllExisting ? AlignmentType_e.Balrog : undefined)));
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
