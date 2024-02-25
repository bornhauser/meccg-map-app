import {Component} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {Card_i, Playable_e} from '../interfaces/interfaces';
import {DataService} from '../services/data.service';

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

  private mapLayer: any = {
    layerWithFocusedMarker: L.featureGroup(),
  };

  constructor(
    public $data: DataService
  ) {

  }

  public generateMap2() {
    this.map = L.map('leafletMap', {
      crs: L.CRS.Simple,
      minZoom: -100,
      maxZoom: 100,
      maxBounds: [
        [0, 0],
        [this.height, this.width]
      ],
    }).on('movestart', () => {
      this.$data.mapIsDradding = true;
    }).on('moveend', () => {
      setTimeout(() => {
        this.$data.mapIsDradding = false;
      }, 100);
    });
    this.map.doubleClickZoom.disable();
    const bounds: any = [[0, 0], [this.height, this.width]];
    L.imageOverlay('assets/img/map/map.jpg', bounds, {
      className: 'meccg-map'
    }).addTo(this.map);
    L.imageOverlay('assets/img/map/border.png', bounds, {
      className: 'meccg-border'
    }).addTo(this.map);
    this.map.fitBounds(bounds);
    this.map.setZoom(-1);
    var svgElement: any = document.querySelector('app-regions-svg svg');
    L.svgOverlay(svgElement, bounds, {
      className: 'meccg-regions',
      interactive: true
    }).addTo(this.map);
    const svgContainer: any = document.querySelector('.meccg-regions');

    // REGIONS
    const regionCards: Card_i[] = this.$data.filterOfficial(this.$data.filterRegions(this.$data.cards));
    regionCards.forEach((card) => {
      var borderSvg: any = document.querySelector('path' + this.$data.getSvgId(card));
      borderSvg?.setAttribute('stroke', '#492045');
      var iconSvg: any = document.querySelector('circle' + this.$data.getSvgId(card));
      iconSvg?.setAttribute('fill', 'none');
      var svgElement: any = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      const x = iconSvg.cx.animVal.value;
      const y = iconSvg.cy.animVal.value;
      console.log(card.id)
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
      svgContainer.appendChild(svgElement);
      borderSvg?.setAttribute('id', card.id);
      // @ts-ignore
      const element = document.getElementById(card.id);
      element?.addEventListener('click', () => { // @ts-ignore
        document.onSiteClick(card)
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
        const creatureIconId: string = this.$data.getSiteCreatureId(card) ?
          `<div class="creature-icon" style="background-image: url('assets/img/creature/${this.$data.getSiteCreatureId(card)}.svg')"></div>` : '';
        const meta: string = playableHtml ? `
          <div class="meta-container">
            <div class="meta">
              ${playableHtml}
            </div>
          </div>` : '';
        this.$data.getSiteCreatureId(card);
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
        svgContainer.appendChild(svgElement);
        // @ts-ignore
        const element = document.getElementById(id);
        element?.addEventListener('click', function () { // @ts-ignore
          document.onSiteClick(card, this);
        });
        element?.addEventListener('dblclick', function () { // @ts-ignore
          document.onSiteDoubleClick(card, this);
        });
      }
    })
  }
}
