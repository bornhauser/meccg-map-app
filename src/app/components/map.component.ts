import {Component} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {Card_i, Playable_e} from '../interfaces/interfaces';
import {DataService} from '../services/data.service';
import {copyObject} from '../services/utility-methods';

@Component({
  selector: 'app-map',
  template: `
    <div>
      <div id="leafletMap" class="leaflet-map"></div>
    </div>
    <app-regions-svg class="region-svg" (svgIsReady)="generateMap2()"></app-regions-svg>

  `,
})
export class MapComponent {
  public map: any;
  public height: number = 6639;
  public width: number = 9890;
  public bounds: any = [[0, 0], [this.height, this.width]];


  private mapLayer: any = {
    layerWithFocusedMarker: L.featureGroup(),
  };

  constructor(
    public $data: DataService
  ) {

    $data.refreshMapContent = () => {
      this.handleVisuals();
    }

  }

  public generateMap2() {
    const bound: number = 500;
    this.map = L.map('leafletMap', {
      crs: L.CRS.Simple,
      minZoom: -100,
      maxZoom: 100,
      // maxBounds: [
      //   [-bound, -bound],
      //   [this.height + bound, this.width + bound]
      // ]
    }).on('movestart', () => {
      this.$data.mapIsDradding = true;
    }).on('moveend', () => {
      setTimeout(() => {
        this.$data.mapIsDradding = false;
      }, 100);
    });
    this.map.doubleClickZoom.disable();
    L.imageOverlay('assets/img/map/map.jpg', this.bounds, {
      className: 'meccg-map'
    }).addTo(this.map);
    L.imageOverlay('assets/img/map/border.png', this.bounds, {
      className: 'meccg-border'
    }).addTo(this.map);
    this.map.fitBounds(this.bounds);
    this.map.setZoom(-2);
    this.renderMapContent();
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

  public renderMapContent() {
    var svgElement: any = document.querySelector('app-regions-svg svg');
    L.svgOverlay(svgElement, this.bounds, {
      className: 'meccg-regions',
      interactive: true
    }).addTo(this.map);
    const svgContainer: any = document.querySelector('.meccg-regions');
    document.querySelector('path#mountain-1')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-2')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-3')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-4')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-5')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-6')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-7')?.setAttribute('class', 'mountain-svg');
    document.querySelector('path#mountain-8')?.setAttribute('class', 'mountain-svg');

    // REGIONS
    let regionCards: Card_i[] = []
    regionCards = this.$data.filterOfficial(this.$data.filterRegions(this.$data.cards));
    regionCards.forEach((card) => {
      var borderSvg: any = document.querySelector('path' + this.$data.getSvgId(card));
      borderSvg?.setAttribute('stroke', '#492045');
      borderSvg?.setAttribute('class', 'region-path')
      borderSvg?.setAttribute('aria-label', '0');
      var iconSvg: any = document.querySelector('circle' + this.$data.getSvgId(card));
      iconSvg?.setAttribute('fill', 'none');
      var svgElement: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      const x = iconSvg.cx.animVal.value;
      const y = iconSvg.cy.animVal.value;
      svgElement.setAttribute('class', 'region-object')
      svgElement.setAttribute('x', x - 600);
      svgElement.setAttribute('y', y - 180);
      svgElement.setAttribute('width', '1200');
      svgElement.setAttribute('height', '300');
      svgElement.innerHTML = `
        <div class="region-title-object" xmlns="http://www.w3.org/1999/xhtml">
            <div class="title-container">
                <div class="title _2">${card.title}</div>
                <div class="title _1">${card.title}</div>
            </div>
            <div class="icon" style="background-image: url('assets/img/region/${card.RPath?.toLowerCase()}.svg')"></div>
        </div>
        `;
      svgElement?.setAttribute('id', card.id);
      svgContainer.appendChild(svgElement);
      borderSvg?.setAttribute('id', card.id);
      // @ts-ignore
      const element = document.getElementById(card.id);
      element?.addEventListener('click', () => { // @ts-ignore
        document.onSiteClick(card, this)
      });
    })

    // SITES
    const siteCards: Card_i[] = this.$data.filterOfficial(this.$data.filterAlignmentHero(this.$data.filterSites(this.$data.cards)));
    siteCards.forEach((card) => {
      var siteSvg: any = document.querySelector('rect' + this.$data.getSvgId(card));
      if (siteSvg) {
        siteSvg?.setAttribute('fill', 'none');
        var svgElement: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        const x = siteSvg.x.animVal.value;
        const y = siteSvg.y.animVal.value;
        svgElement.setAttribute('class', 'site-object')
        svgElement.setAttribute('class', 'site-object')
        svgElement.setAttribute('x', x - 70);
        svgElement.setAttribute('y', y - 50);
        svgElement.setAttribute('width', '1200');
        svgElement.setAttribute('height', '200');
        const playables = this.$data.getPlayables(card);
        let playableHtml = '';
        playableHtml += playables?.[Playable_e.minor] ? '<div class="playable _minor"></div>' : '';
        playableHtml += playables?.[Playable_e.major] ? '<div class="playable _major"></div>' : '';
        playableHtml += playables?.[Playable_e.greater] ? '<div class="playable _greater"></div>' : '';
        playableHtml += playables?.[Playable_e.gold_ring] ? '<div class="playable _gold_ring"></div>' : '';
        playableHtml += playables?.[Playable_e.information] ? '<div class="playable _information"></div>' : '';
        playableHtml += playables?.[Playable_e.palantiri] ? '<div class="playable _palantiri"></div>' : '';
        playableHtml += playables?.[Playable_e.scrol_of_isildur] ? '<div class="playable _scrol_of_isildur"></div>' : '';
        const id = 'id_' + Math.random();
        const creatureIconId: string = this.$data.getCreatureId(card) ?
          `<div class="creature-icon" style="background-image: url('assets/img/creature/${this.$data.getCreatureId(card)}.svg')"></div>` : '';
        const meta: string = playableHtml ? `
          <div class="meta-container">
            <div class="meta">
              ${playableHtml}
            </div>
          </div>` : '';
        this.$data.getCreatureId(card);
        const stringifiedCard = JSON.stringify(card);
        svgElement.innerHTML = `
         <div class="content-frame" xmlns="http://www.w3.org/1999/xhtml">
            <button class="site-button" id="${id}">
              <div class="pergament">
                <div class="icon" style="background-image: url('assets/img/site/${this.$data.getSiteIconName(card)}.svg')"></div>
                <div class="title">
                    ${card.title}
                </div>
              </div>
              ${meta}
              ${creatureIconId}
            </button>
        </div>
        `;
        svgElement?.setAttribute('id', card.id);
        svgContainer.appendChild(svgElement);
        // @ts-ignore
        const element = document.getElementById(id);
        element?.addEventListener('click', function () { // @ts-ignore
          document.onSiteClick(card, this);
        });
      }
    })
  }
}
