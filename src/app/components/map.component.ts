import {Component} from '@angular/core';
import * as L from 'leaflet';
import {LatLngBounds} from 'leaflet';
import {Card_i, CardType_e, Playable_e, Playables_i} from '../interfaces/interfaces';
import {DataService} from '../services/data.service';
import {AppService} from '../services/app-service';

@Component({
  selector: 'app-map',
  template: `

    <div class="leaflet-map-container">
      <div id="leafletMap" class="leaflet-map"></div>
      <app-regions-svg class="region-svg" (svgIsReady)="generateMap2()"></app-regions-svg>
    </div>

  `,
})
export class MapComponent {
  public map: any;
  public height: number = 663;
  public width: number = 989;
  public bounds: any = [[0, 0], [this.height, this.width]];
  public svgLayer: any;
  public svgLayerLeaflet: any;

  constructor(
    public $data: DataService,
    public $app: AppService,
  ) {
    $data.refreshContentOnMap = () => {
      this.handleVisuals();
    }
    $data.focusOnMap = (items: Card_i[]) => {
      this.focusItems(items);
    }
    $data.refreshRouteOnMap = () => {
      this.refreshRoute();
      this.refreshFocusedSite();
    }
    $data.refreshMapContent = () => {
      this.refreshMapContent();
    }
  }

  public generateMap2() {
    const mapSettings1 = {
      crs: L.CRS.Simple,
      minZoom: -0.5,
      maxZoom: 1.7,
      zoomControl: false,
      bounceAtZoomLimits: false,
      doubleClickZoom: false,
    }
    this.map = L.map('leafletMap', mapSettings1)
      .on('movestart', () => {
        this.$data.mapIsDradding = true;
      }).on('moveend', () => {
        setTimeout(() => {
          this.$data.mapIsDradding = false;
        }, 100);
      }).on('dblclick', () => {
        setTimeout(() => {
          if (this.$data.currentSiteFrom) {
            this.$data.endJourney();
          } else {
            this.$data.startJourney();
          }
        }, 100);
      });
    this.map.setView([this.height / 2, this.width / 2], 0.3);
    L.imageOverlay('assets/img/map/map_z.jpg', this.bounds, {
      className: 'meccg-border'
    }).addTo(this.map);
    L.imageOverlay('assets/img/map/border_smaller.png', this.bounds, {
      className: 'meccg-border'
    }).addTo(this.map);
    this.refreshMapContent();
  }

  public refreshMapContent() {
    this.$data.endJourney();
    if (this.svgLayerLeaflet) {
      this.map.removeLayer(this.svgLayerLeaflet);
    }
    setTimeout(() => {
      this.renderMapRegionsContent();
      setTimeout(() => {
        this.renderMapSites();
      }, 200);
    }, 200);
  }

  public renderMapRegionsContent() {
    const svgLayer = document.querySelector('app-regions-svg svg');
    this.svgLayer = svgLayer?.cloneNode(true);
    document.querySelector('path#mountain-1')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-2')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-3')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-4')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-5')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-6')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-7')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-8')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-9')?.setAttribute('class', 'mountain-svg');
    let allRegionCards: Card_i[] = this.$data.filterOfficial(this.$data.filterRegions(this.$data.cards));
    allRegionCards.forEach((card) => {
      var regionPathSvg: any = document.querySelector('path' + this.$data.getSvgId(card));
      regionPathSvg?.setAttribute('stroke', '#492045');
      regionPathSvg?.setAttribute('class', 'region-path')
      regionPathSvg?.setAttribute('aria-label', '0');
      regionPathSvg?.setAttribute('id', this.$data.getRegionPathId(card));
      var passmarkerForRegionLabel: any = document.querySelector('circle' + this.$data.getSvgId(card));
      passmarkerForRegionLabel?.setAttribute('fill', 'none');
      var regionLabelSvg: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      const x = passmarkerForRegionLabel.cx.animVal.value;
      const y = passmarkerForRegionLabel.cy.animVal.value;
      regionLabelSvg.setAttribute('class', 'region-label')
      regionLabelSvg.setAttribute('x', x - 600);
      regionLabelSvg.setAttribute('y', y - 180);
      regionLabelSvg.setAttribute('width', '1200');
      regionLabelSvg.setAttribute('height', '300');
      regionLabelSvg.innerHTML = `
        <div class="region-title-object" xmlns="http://www.w3.org/1999/xhtml">
            <div class="title">${ this.$data.getCardTitle(card) }</div>
            <div class="icon" style="background-image: url('${this.$data.getRegionIconUrl(card)}')"></div>
        </div>
        `;
      regionLabelSvg?.setAttribute('id', this.$data.getRegionLabelId(card));
      this.svgLayer?.appendChild(regionLabelSvg);
      regionPathSvg?.addEventListener('click', () => {
        // @ts-ignore
        document.onSiteOrRegionClick(card, this)
      });
      this.svgLayerLeaflet = L.svgOverlay(this.svgLayer, this.bounds, {
        className: 'svg-layer',
        interactive: true,
      }).addTo(this.map);
    })
  }

  public renderMapSites() {
    // SITES
    const siteCards: Card_i[] = this.$data.filterOfficial(this.$data.filterSites(this.$data.cards));
    siteCards.forEach((card) => {
      var siteSvg: any = document.querySelector('rect' + this.$data.getSvgId(card));
      if (siteSvg) {
        siteSvg?.setAttribute('fill', 'none');
        var svgElement: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        const x = siteSvg.x.animVal.value;
        const y = siteSvg.y.animVal.value;
        svgElement.setAttribute('class', 'site-object')
        svgElement.setAttribute('x', x - 70);
        svgElement.setAttribute('y', y - 50);
        svgElement.setAttribute('width', '1200');
        svgElement.setAttribute('height', '200');
        const playables: Playables_i | null = this.$data.getPlayables(card);
        let playableHtml: string = '';
        playableHtml += playables?.[Playable_e.minor] ? '<div class="playable _minor"></div>' : '';
        playableHtml += playables?.[Playable_e.major] ? '<div class="playable _major"></div>' : '';
        playableHtml += playables?.[Playable_e.greater] ? '<div class="playable _greater"></div>' : '';
        playableHtml += playables?.[Playable_e.gold_ring] ? '<div class="playable _gold_ring"></div>' : '';
        playableHtml += playables?.[Playable_e.information] ? '<div class="playable _information"></div>' : '';
        // playableHtml += playables?.[Playable_e.palantiri] ? '<div class="playable _palantiri"></div>' : '';
        // playableHtml += playables?.[Playable_e.scrol_of_isildur] ? '<div class="playable _scrol_of_isildur"></div>' : '';
        const creatureIcon: string = this.$data.getCreatureId(card) ?
          `<div class="creature-icon" style="background-image: url('${this.$data.getCreatureIconUrl(card)}')"></div>` : '';
        const meta: string = playableHtml ? `
          <div class="meta-container">
            <div class="meta">
              ${playableHtml}
            </div>
          </div>` : '';
        this.$data.getCreatureId(card);
        const id = 'id_' + Math.random();
        svgElement.innerHTML = `
          <div class="content-frame" xmlns="http://www.w3.org/1999/xhtml">
            <div class="site-button" id="${id}">
              ${meta}
              <div class="pergament-container">
                <div class="pergament">
                  <div class="site-icon" style="background-image: url('${this.$data.getSiteIconUrl(card)}')"></div>
                  <div class="site-title">${ this.$data.getCardTitle(card) }</div>
                </div>
              </div>
            </div>
          </div>
        `;
        svgElement?.setAttribute('id', card.id);
        this.svgLayer?.appendChild(svgElement);
        // @ts-ignore
        const element = document.getElementById(id);
        element?.addEventListener('click', function () { // @ts-ignore
          document.onSiteOrRegionClick(card, this);
        });
      }
    })
  }

  public refreshRoute() {
    let allRegionCards = this.$data.filterOfficial(this.$data.filterRegions(this.$data.cards));
    allRegionCards.forEach((card) => {
      var borderSvg: any = document.querySelector('#' + this.$data.getRegionPathId(card));
      borderSvg?.setAttribute('aria-description', '0');
    });
    this.$data.currentRouteRegions.forEach((card) => {
      var borderSvg: any = document.querySelector('#' + this.$data.getRegionPathId(card));
      borderSvg?.setAttribute('aria-description', '1');
    });

    let allSiteCards = this.$data.filterOfficial(this.$data.filterAlignmentHero(this.$data.filterSites(this.$data.cards)));
    allSiteCards.forEach((card) => {
      var siteSvg: any = document.querySelector('foreignObject#' + card.id);
      siteSvg?.setAttribute('aria-description', '0');
    });
    if (this.$data.currentSiteFrom) {
      var siteSvg: any = document.querySelector('foreignObject#' + (this.$data.currentSiteFrom?.id ?? ''));
      siteSvg?.setAttribute('aria-description', '1');
    }
    if (this.$data.currentSiteTo) {
      var site2Svg: any = document.querySelector('foreignObject#' + (this.$data.currentSiteTo?.id ?? ''));
      site2Svg?.setAttribute('aria-description', '1');
    }
  }

  public refreshFocusedSite() {
    let allSiteCards = this.$data.filterOfficial(this.$data.filterAlignmentHero(this.$data.filterSites(this.$data.cards)));
    allSiteCards.forEach((card) => {
      var siteSvg: any = document.querySelector('foreignObject#' + card.id);
      siteSvg?.setAttribute('aria-describedby', '0');
    });
    if (this.$data.currentGuiContext.currentSiteOrRegion?.type === CardType_e.Site) {
      var siteSvg: any = document.querySelector('foreignObject#' + (this.$data.currentGuiContext.currentSiteOrRegion?.id ?? ''));
      siteSvg?.setAttribute('aria-describedby', '1');
    }
  }

  public focusItems(items: Card_i[]) {
    const card: Card_i = items[0];
    if (card.type === CardType_e.Region) {
      const svgElement: any = document.querySelector('path#' + card.id);
      const rect = svgElement.getBoundingClientRect();
      const topLeft = this.map.containerPointToLatLng(L.point(rect.left, rect.top));
      const bottomRight = this.map.containerPointToLatLng(L.point(rect.right, rect.bottom));
      const bounds: LatLngBounds = L.latLngBounds(topLeft, bottomRight);
      this.map.fitBounds(bounds, {maxZoom: -2});
    }
  }

  public handleVisuals() {
    let regionCards = this.$data.filterOfficial(this.$data.filterRegions(this.$data.cards));
    if (this.$data.currentSiteFrom && this.$data.currentGuiContext.currentReachableRegions) {
      regionCards.forEach((card) => {
        var borderSvg: any = document.querySelector('path#' + card.id);
        var labelSvg: any = document.querySelector('foreignObject#' + card.id);
        borderSvg?.setAttribute('aria-label', '1');
        labelSvg?.setAttribute('display', 'none');
      });
      regionCards = this.$data.currentGuiContext.currentReachableRegions;
      regionCards.forEach((card) => {
        var borderSvg: any = document.querySelector('path#' + card.id);
        var labelSvg: any = document.querySelector('foreignObject#' + card.id);
        borderSvg?.setAttribute('aria-label', '0');
        labelSvg?.setAttribute('display', 'block');
      });
    } else {
      regionCards.forEach((card) => {
        var borderSvg: any = document.querySelector('path#' + card.id);
        var labelSvg: any = document.querySelector('foreignObject#' + card.id);
        borderSvg?.setAttribute('aria-label', '0');
        labelSvg?.setAttribute('display', 'block');
      });
    }

    let siteCards = this.$data.filterOfficial(this.$data.filterAlignmentHero(this.$data.filterSites(this.$data.cards)));
    if (this.$data.currentSiteFrom && this.$data.currentGuiContext.currentReachableSites) {
      siteCards.forEach((card) => {
        var siteSvg: any = document.querySelector('foreignObject#' + card.id);
        siteSvg?.setAttribute('display', 'none');
      });
      siteCards = this.$data.currentGuiContext.currentReachableSites;
      siteCards.forEach((card) => {
        var siteSvg: any = document.querySelector('foreignObject#' + card.id);
        siteSvg?.setAttribute('display', 'block');
      });
    } else {
      siteCards.forEach((card) => {
        var siteSvg: any = document.querySelector('foreignObject#' + card.id);
        siteSvg?.setAttribute('display', 'block');
      });
    }
  }

}
