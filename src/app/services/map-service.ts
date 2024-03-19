import {Injectable} from '@angular/core';
import {AppService} from './app-service';
import {CardUtilService} from './card-util.service';
import * as L from 'leaflet';
import {AlignmentType_e, Card_i, CardType_e, Playable_e, Playables_i} from '../interfaces/interfaces';
import {DataService} from './data.service';
import {copyObject} from './utility-methods';
import {Map, MapOptions} from 'leaflet';

@Injectable()
export class MapService {

  public map: Map | null = null;
  public height: number = 663;
  public width: number = 989;
  public bounds: any = [[0, 0], [this.height, this.width]];

  public layerWithUnderdeepImage: L.ImageOverlay | null = null;
  public layerWithUnderdeepSvg: L.SVGOverlay | null = null;
  public layerWithUnderdeepSites: any;
  public layerWithUnderdeepSitesClass: string = 'svg-layer-underdeep-sites';
  public layerWithUnderdeepNumbers: L.SVGOverlay | null = null;
  public layerWithUnderdeepNumbersClass: string = 'svg-layer-underdeep-numbers';

  public layerWithRegionLabel: any;
  public layerWithRegionLabelClass: string = 'svg-layer-region-labels';
  public layerWithSites: any;
  public layerWithSitesClass: string = 'svg-layer-sites';

  constructor(
    public $app: AppService,
    public $cardUtil: CardUtilService,
    public $data: DataService,
  ) {
    $data.$map = this;
  }

  public generateMap() {
    const mapSettings1: MapOptions = {
      crs: L.CRS.Simple,
      minZoom: -0.5,
      maxZoom: 27,
      zoomControl: false,
      bounceAtZoomLimits: false,
      doubleClickZoom: false,
    }
    this.map = L.map('leafletMap', mapSettings1)
      .on('movestart', () => {
        this.$app.mapIsDradding = true;
      }).on('moveend', () => {
        setTimeout(() => {
          this.$app.mapIsDradding = false;
        }, 100);
      }).on('dblclick', () => {
        setTimeout(() => {
          this.$data.resetCurrentGuiContext();
        }, 100);
      });
    this.map.setView([this.height / 2, this.width / 2], 0.3);
    this.layerWithUnderdeepImage = L.imageOverlay('assets/img/map/map_deeps.jpg', this.bounds, {
      className: 'meccg-underdeeps-image',
      interactive: false,
    }).addTo(this.map);
    this.layerWithUnderdeepSvg = L.svgOverlay(document.querySelector('app-underdeeps-svg svg') as SVGElement, this.bounds, {
      className: 'svg-layer-underdeeps',
      interactive: false,
    }).addTo(this.map);
    L.imageOverlay('assets/img/map/map_z.jpg', this.bounds, {
      className: 'meccg-map-image _surface',
      interactive: false,
    }).addTo(this.map);
    L.imageOverlay('assets/img/map/border_smaller.png', this.bounds, {
      className: 'meccg-border _surface',
      interactive: false,
    }).addTo(this.map);
    L.svgOverlay(document.querySelector('app-regions-svg svg') as SVGElement, this.bounds, {
      className: 'svg-layer _surface',
      interactive: true,
    }).addTo(this.map);
    document.querySelector('.svg-layer path#mountain-1')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-2')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-3')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-4')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-5')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-6')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-7')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-8')?.setAttribute('class', 'mountain-svg');
    document.querySelector('.svg-layer path#mountain-9')?.setAttribute('class', 'mountain-svg');
    this.renderRegionLabelAndSites();
  }

  public renderRegionLabelAndSites() {
    if (this.map) {

      this.$data.endJourney();
      if (this.layerWithUnderdeepSites) {
        this.map.removeLayer(this.layerWithUnderdeepSites);
      }
      if (this.layerWithUnderdeepSites) {
        this.map.removeLayer(this.layerWithUnderdeepSites);
      }
      if (this.layerWithUnderdeepNumbers) {
        this.map.removeLayer(this.layerWithUnderdeepNumbers);
      }
      if (this.layerWithSites) {
        this.map.removeLayer(this.layerWithSites);
      }
      if (this.layerWithRegionLabel) {
        this.map.removeLayer(this.layerWithRegionLabel);
      }
      this.renderRegions();
      this.renderUnderDeeps();
      this.renderMapSites(false);
      this.renderMapSites(true);
      this.layerWithUnderdeepSites?.bringToBack();
      this.layerWithUnderdeepSvg?.bringToBack();
      this.layerWithUnderdeepImage?.bringToBack();
      this.renderActivities();
    }
  }

  public renderUnderDeeps() {
    if (this.map) {
      this.layerWithUnderdeepNumbers = L.svgOverlay(this.getEmptySvg(), this.bounds, {
        className: this.layerWithUnderdeepNumbersClass,
        interactive: false
      }).addTo(this.map);
      const underdeepNumbers = this.$data.getUnderdeepMoveNumbers();
      for (let key in underdeepNumbers) {
        const underDeepsCircle: any = document.querySelector('.svg-layer-underdeeps circle#' + key);
        if (underDeepsCircle) {
          const x: number = underDeepsCircle.cx.animVal.value;
          const y: number = underDeepsCircle.cy.animVal.value;
          var regionLabelSvg: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
          regionLabelSvg.setAttribute('class', 'under-deep-number-foreign-object');
          regionLabelSvg.setAttribute('id', key);
          regionLabelSvg.setAttribute('x', x - 70);
          regionLabelSvg.setAttribute('y', y - 70);
          regionLabelSvg.setAttribute('width', '200');
          regionLabelSvg.setAttribute('height', '200');
          regionLabelSvg.innerHTML = `
        <div class="under-deep-number" xmlns="http://www.w3.org/1999/xhtml">
          <div class="under-deep-circle-1">
            <div class="under-deep-circle-2">
              <div class="text-content">${underdeepNumbers[key]}</div>
            </div>
          </div>
        </div>
        `;
          document.querySelector('.' + this.layerWithUnderdeepNumbersClass)?.appendChild(regionLabelSvg);
        }
      }
    }
  }

  public getEmptySvg(): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 ' + (this.width * 10) + ' ' + (this.height * 10));
    return svg;
  }

  public renderRegions() {
    if (this.map) {
      this.layerWithRegionLabel = L.svgOverlay(this.getEmptySvg(), this.bounds, {
        className: this.layerWithRegionLabelClass + ' _surface',
        interactive: false,
      }).addTo(this.map);
      let allRegionCards: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterRegions(this.$data.all_cards));
      allRegionCards.forEach((card) => {
        const regionPathSvg: any = document.querySelector('.svg-layer path' + this.$data.getSketchId(card));
        regionPathSvg?.setAttribute('class', 'region-path');
        regionPathSvg?.setAttribute('aria-label', '0');
        regionPathSvg?.setAttribute('aria-description', '0');
        regionPathSvg?.setAttribute('id', this.$cardUtil.getRegionPathId(card));
        const passmarkerForRegionLabel: any = document.querySelector('circle' + this.$data.getSketchId(card));
        const x = passmarkerForRegionLabel.cx.animVal.value;
        const y = passmarkerForRegionLabel.cy.animVal.value;
        const regionLabelSvg: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        regionLabelSvg.setAttribute('class', 'region-label');
        regionLabelSvg.setAttribute('x', x - 700);
        regionLabelSvg.setAttribute('y', y - 210);
        regionLabelSvg.setAttribute('width', '1400');
        regionLabelSvg.setAttribute('height', '300');
        regionLabelSvg.setAttribute('id', this.$cardUtil.getRegionLabelId(card));
        regionLabelSvg.innerHTML = `
        <div class="region-title-object" xmlns="http://www.w3.org/1999/xhtml">
            <div class="title">${this.$cardUtil.getCardTitle(card)}</div>
            <div class="icon" style="background-image: url('${this.$cardUtil.getRegionIconUrl(card)}')"></div>
        </div>
        `;
        document.querySelector('.svg-layer-region-labels')?.appendChild(regionLabelSvg);
        regionPathSvg?.addEventListener('click', ($event: any) => {
          // @ts-ignore
          document.onSiteOrRegionClick(card, $event, this)
        });
      })
    }
  }

  public renderMapSites(isUnderDeeps: boolean) {
    if (this.map) {
      if (isUnderDeeps) {
        this.layerWithUnderdeepSites = L.svgOverlay(this.getEmptySvg(), this.bounds, {
          className: this.layerWithUnderdeepSitesClass,
          interactive: true,
        }).addTo(this.map);
      } else {
        this.layerWithSites = L.svgOverlay(this.getEmptySvg(), this.bounds, {
          className: this.layerWithSitesClass + ' _surface',
          interactive: true,
        }).addTo(this.map);
      }
      let all_siteCards: Card_i[] = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.$data.all_cards, isUnderDeeps));
      all_siteCards.forEach((card) => {
        let siteSvg: any
        if (isUnderDeeps) {
          if (
            this.$data.currentGuiContext_persistent.currentAlignment !== AlignmentType_e.Balrog &&
            (card.normalizedtitle === 'iron hill dwarf-hold' ||
              card.normalizedtitle === 'the wind throne' ||
              card.normalizedtitle === 'blue mountain dwarf-hold')
          ) {
            return;
          }
          siteSvg = document.querySelector('.svg-layer-underdeeps' + ' rect' + this.$data.getSketchId(card));
        } else {
          siteSvg = document.querySelector('.svg-layer' + ' rect' + this.$data.getSketchId(card));
        }
        if (siteSvg) {
          const svgElement: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
          const x = siteSvg.x.animVal.value;
          const y = siteSvg.y.animVal.value;
          svgElement.setAttribute('class', 'site-object')
          svgElement.setAttribute('x', x - 70);
          svgElement.setAttribute('y', y - 50);
          svgElement.setAttribute('width', '1200');
          svgElement.setAttribute('height', '200');
          svgElement?.setAttribute('id', this.$cardUtil.getSiteLabelId(card));
          const playables: Playables_i | null = this.$cardUtil.getPlayablesOfCard(card);
          let playableHtml: string = '';
          playableHtml += playables?.[Playable_e.minor] ? '<div class="playable _minor"></div>' : '';
          playableHtml += playables?.[Playable_e.major] ? '<div class="playable _major"></div>' : '';
          playableHtml += playables?.[Playable_e.greater] ? '<div class="playable _greater"></div>' : '';
          playableHtml += playables?.[Playable_e.gold_ring] ? '<div class="playable _gold_ring"></div>' : '';
          playableHtml += playables?.[Playable_e.information] ? '<div class="playable _information"></div>' : '';
          playableHtml += playables?.[Playable_e.dragonHoard] ? '<div class="playable _dragon-hoard"></div>' : '';
          const creatureIconUrl: string = this.$cardUtil.getCreatureIconUrl(card) ?? '';
          const creatureIcon: string = this.$cardUtil.getCreatureId(card) ?
            `<div class="creature-icon" style="background-image: url('${creatureIconUrl}')"></div>` : '';
          const meta: string = playableHtml ? `
          <div class="meta-container">
            <div class="meta">
              ${playableHtml}
            </div>
          </div>` : '';
          this.$cardUtil.getCreatureId(card);
          const id: string = 'id_' + Math.random();
          svgElement.innerHTML = `
          <div class="content-frame" xmlns="http://www.w3.org/1999/xhtml">
            <div class="site-button ${(this.$cardUtil.isUnderDeepSite(card) ? '_under-deep' : '')}" id="${id}">
              ${meta}
              <div class="pergament-container">
                <div class="pergament">
                  <div class="site-icon" style="background-image: url('${this.$cardUtil.getSiteIconUrl(card)}')"></div>
                  <div class="site-title">${this.$cardUtil.getCardTitle(card)}</div>
                  ${creatureIconUrl ? creatureIcon : ''}
                </div>
              </div>
            </div>
          </div>
        `;
          document.querySelector('app-regions-svg svg')?.appendChild(svgElement);
          if (isUnderDeeps) {
            document.querySelector('.' + this.layerWithUnderdeepSitesClass)?.appendChild(svgElement);
          } else {
            document.querySelector('.' + this.layerWithSitesClass)?.appendChild(svgElement);
          }
          // @ts-ignore
          const element: any = document.getElementById(id);
          element?.addEventListener('click', function ($event: any) { // @ts-ignore
            document.onSiteOrRegionClick(card, $event, isUnderDeeps);
          });
          element?.addEventListener('dblclick', function ($event: any) { // @ts-ignore
            document.onSiteOrRegionDoubleClick(card, $event, isUnderDeeps);
          });
        }
      })
    }
  }

  public renderActivities() {
    let allSiteCards = this.$cardUtil.filterOfficial(this.$cardUtil.filterSites(this.$data.all_cards, true));
    let allRegionCards = this.$cardUtil.filterOfficial(this.$cardUtil.filterRegions(this.$data.all_cards));
    // FOCUS SITE
    allSiteCards.forEach((card) => {
      const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
      svg?.setAttribute('aria-describedby', '0');
      const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
      svg2?.setAttribute('aria-describedby', '0');
    });
    if (this.$data.currentGuiContext_persistent.currentSiteOrRegion?.type === CardType_e.Site) {
      const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(this.$data.currentGuiContext_persistent.currentSiteOrRegion));
      svg?.setAttribute('aria-describedby', '1');
      const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(this.$data.currentGuiContext_persistent.currentSiteOrRegion));
      svg2?.setAttribute('aria-describedby', '1');
    }
    // REGIONS
    allRegionCards.forEach((card) => {
      const borderSvg: any = document.querySelector('#' + this.$cardUtil.getRegionPathId(card));
      borderSvg?.setAttribute('aria-description', '0');
    });
    this.$data.currentGuiContext_notPersitent.currentJourneyRegions.forEach((card) => {
      const borderSvg: any = document.querySelector('#' + this.$cardUtil.getRegionPathId(card));
      borderSvg?.setAttribute('aria-description', '1');
    });
    // JOURNEY FOCUS SITES
    allSiteCards.forEach((card) => {
      const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
      svg?.setAttribute('aria-description', '0');
      const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
      svg2?.setAttribute('aria-description', '0');
    });
    if (this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom) {
      const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom));
      svg?.setAttribute('aria-description', '1');
      const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom));
      svg2?.setAttribute('aria-description', '1');
    }
    if (this.$data.currentGuiContext_notPersitent.currentJourneySiteTo) {
      const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(this.$data.currentGuiContext_notPersitent.currentJourneySiteTo));
      svg?.setAttribute('aria-description', '1');
      const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(this.$data.currentGuiContext_notPersitent.currentJourneySiteTo));
      svg2?.setAttribute('aria-description', '1');
    }
    // JOURNEY DISAPEAR REGIONS
    if (this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom && this.$data.currentGuiContext_persistent.currentReachableRegions) {
      allRegionCards.forEach((card) => {
        const svg: any = document.querySelector('#' + this.$cardUtil.getRegionPathId(card));
        svg?.setAttribute('aria-label', '1');
        const svg2: any = document.querySelector('#' + this.$cardUtil.getRegionLabelId(card));
        svg2?.setAttribute('display', 'none');
      });
      allRegionCards = this.$data.currentGuiContext_persistent.currentReachableRegions;
      allRegionCards.forEach((card) => {
        const svg: any = document.querySelector('#' + this.$cardUtil.getRegionPathId(card));
        svg?.setAttribute('aria-label', '0');
        const svg2: any = document.querySelector('#' + this.$cardUtil.getRegionLabelId(card));
        svg2?.setAttribute('display', 'block');
      });
    } else {
      allRegionCards.forEach((card) => {
        const svg: any = document.querySelector('#' + this.$cardUtil.getRegionPathId(card));
        svg?.setAttribute('aria-label', '0');
        const svg2: any = document.querySelector('#' + this.$cardUtil.getRegionLabelId(card));
        svg2?.setAttribute('display', 'block');
      });
    }
    // JOURNEY DISAPEAR SITES
    if (this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom && this.$data.currentGuiContext_persistent.currentReachableSites) {
      allSiteCards.forEach((card) => {
        const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
        svg?.setAttribute('display', 'none');
        const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
        svg2?.setAttribute('display', 'none');
      });
      const allReachableSiteCards: Card_i[] = copyObject(this.$data.currentGuiContext_persistent.currentReachableSites);
      allReachableSiteCards.push(this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom);
      allReachableSiteCards.forEach((card) => {
        const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
        svg?.setAttribute('display', 'block');
        const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
        svg2?.setAttribute('display', 'block');
      });
    } else {
      allSiteCards.forEach((card) => {
        const svg: any = document.querySelector('.' + this.layerWithSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
        svg?.setAttribute('display', 'block');
        const svg2: any = document.querySelector('.' + this.layerWithUnderdeepSitesClass + ' #' + this.$cardUtil.getSiteLabelId(card));
        svg2?.setAttribute('display', 'block');
      });
    }
    // JOURNEY UNDERDEEPS
    document.querySelector('.svg-layer-underdeeps g#any-ancient-deep-hold')?.setAttribute('aria-description', '0');
    const all_underDeepNumbers = this.$data.getUnderdeepMoveNumbers(undefined, true);
    for (let key in all_underDeepNumbers) {
      document.querySelector('.svg-layer-underdeeps g#' + key)?.setAttribute('aria-description', '0');
      document.querySelectorAll('.under-deep-number-foreign-object')?.forEach((element) => {
        element.setAttribute('aria-description', '0');
      })
    }
    if (this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom) {
      const all_underDeepNumbersFromThisSite = this.$data.getUnderdeepMoveNumbers(this.$data.currentGuiContext_notPersitent.currentJourneySiteFrom);
      for (let key in all_underDeepNumbersFromThisSite) {
        document.querySelector('.svg-layer-underdeeps g#' + key)?.setAttribute('aria-description', '1');
        document.querySelector('.under-deep-number-foreign-object#' + key)?.setAttribute('aria-description', '1');
        if (key === 'x_ancient-deep-hold') {
          document.querySelector('.svg-layer-underdeeps g#any-ancient-deep-hold')?.setAttribute('aria-description', '1');
        }
      }
    } else {
      if (this.$data.currentGuiContext_persistent.currentAlignment === AlignmentType_e.Balrog) {
        document.querySelector('.svg-layer-underdeeps g#any-ancient-deep-hold')?.setAttribute('aria-description', '1');
      }
      const relevant_underDeepNumbers = this.$data.getUnderdeepMoveNumbers();
      for (let key in relevant_underDeepNumbers) {
        document.querySelector('.svg-layer-underdeeps g#' + key)?.setAttribute('aria-description', '1');
        document.querySelector('.under-deep-number-foreign-object#' + key)?.setAttribute('aria-description', '1');
      }
    }
  }
}
