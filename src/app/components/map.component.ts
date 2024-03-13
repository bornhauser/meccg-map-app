import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
import {AppService} from '../services/app-service';
import {MapService} from '../services/map-service';

@Component({
  selector: 'app-map',
  template: `

    <div class="leaflet-map-container" [ngClass]="{'_undergorund-mode': $data.currentGuiContext_persistent.underDeep}">
      <div id="leafletMap" class="leaflet-map"></div>
      <app-regions-svg class="region-svg" (svgIsReady)="$map.generateMap()"></app-regions-svg>
      <app-underdeeps-svg class="undergound-svg"></app-underdeeps-svg>
    </div>

  `,
})
export class MapComponent {

  constructor(
    public $data: DataService,
    public $app: AppService,
    public $map: MapService,
  ) {
  }

}
