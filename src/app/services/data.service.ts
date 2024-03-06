import {Injectable} from '@angular/core';
import {
  AlignmentType_e,
  Card_i,
  CardType_e,
  CurrentGuiContext,
  RegionType_e,
} from '../interfaces/interfaces';
import {copyObject, findId, hasId} from './utility-methods';
import {AppService} from './app-service';
import {CardUtilService} from './card-util.service';

declare var meccgCards: Card_i[] | undefined;

@Injectable()
export class DataService {
  public all_cards: Card_i[] = [];
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
      });
      this.all_cards = meccgCards;
      const savedGuiContext = sessionStorage.getItem('meccg-gui-context')
      if (savedGuiContext) {
        this.currentGuiContext = JSON.parse(savedGuiContext);
      }
    }
    // const sites = this.filterSites(this.filterOfficial(this.all_cards));
    // const regions = this.filterRegions(this.filterOfficial(this.all_cards));
    // regions.forEach((card) => {
    //   sites.push(card);
    // })
  }

  public resetCurrentGuiContext() {
    this.currentGuiContext.currentSiteOrRegion = null;
    this.currentGuiContext.currentReachableRegions = [];
    this.currentGuiContext.currentReachableSites = [];
  }

  public saveCurrentStates() {
    sessionStorage.setItem('meccg-gui-context', JSON.stringify(this.currentGuiContext));
  }

  public string_between_strings(startStr: string, endStr: string, str: string) {
    const pos: number = str.indexOf(startStr) + startStr.length;
    return str.substring(pos, str.indexOf(endStr, pos));
  }

  public getSvgId(card: Card_i): string {
    return '#' + card.normalizedtitle?.replaceAll(' ', '-').replaceAll('&', 'and').replaceAll('\'', '-')
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
    if (card_site.type === CardType_e.Site) {
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
      const card_sites: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.all_cards));
      card_sites.forEach((card_site: Card_i) => {
        if (card_region.title === card_site.Region) {
          answer.push(card_site);
        }
      });
    }
    return answer;
  };

  public onSiteOrRegionClick(card: Card_i): void {
    if (this.currentSiteFrom) {
      if (card.type === CardType_e.Site) {
        const foundCard = findId(this.currentGuiContext.currentReachableSites, card.id);
        this.currentSiteTo = foundCard as Card_i;
        if (!hasId(this.currentRouteRegions, this.getRegionOfSite(card)?.id)) {
          this.currentRouteRegions = foundCard?.routingRegions ?? [];
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
    this.$app.refreshRouteOnMap();
  }

  public calculateCurrentPlayableHazards() {
    const allHazardCards: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterHazards(this.all_cards));
    const filteredHazards: Card_i[] = allHazardCards.filter((card: Card_i) => {
      let answer = false;
      this.currentRouteRegions.forEach((regionCard: Card_i) => {
        if (card.text && card.text?.toLowerCase().indexOf(regionCard.title?.toLowerCase() ?? '') > -1) {
          answer = true;
        }
      });
      if (card.text && card.text?.toLowerCase().indexOf(this.currentSiteTo?.title?.toLowerCase() ?? '') > -1) {
        answer = true;
      }
      return answer
    })
    this.currentPlayableHazards = filteredHazards;
  }

  public startJourney(): void {
    if (this.currentGuiContext.currentSiteOrRegion?.type === CardType_e.Site) {
      this.currentSiteFrom = copyObject(this.currentGuiContext.currentSiteOrRegion);
      this.saveCurrentStates();
      this.$app.refreshContentOnMap();
      if (this.currentSiteFrom) {
        const region = this.getRegionOfSite(this.currentSiteFrom);
        if (region) {
          this.currentRouteRegions = [region]
          this.$app.refreshRouteOnMap();
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
    this.$app.refreshContentOnMap();
    this.$app.refreshRouteOnMap();
  }
}
