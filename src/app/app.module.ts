import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {DataService} from './services/data.service';
import {MapComponent} from './components/map.component';
import {SvgComponent} from './components/regions-svg.component';
import {FooterComponent} from './components/footer.component';
import {SiteItemComponent} from './components/site-item.component';
import {HeaderComponent} from './components/header.component';
import {SiteSelectionModalComponent} from './components/modal/site-selection-modal.component';
import {HazardCardsModalComponent} from './components/modal/hazard-cards-modal.component';
import {CardZoomModalComponent} from './components/modal/card-zoom-modal.component';
import {RouteComponent} from './components/route.component';
import {MainMenuModalComponent} from './components/modal/main-menu-modal.component';
import {SelectItemComponent} from './components/modal/select-item.component';
import {AppService} from './services/app-service';
import {CardUtilService} from './services/card-util.service';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SvgComponent,
    FooterComponent,
    SiteItemComponent,
    SiteSelectionModalComponent,
    HeaderComponent,
    HazardCardsModalComponent,
    CardZoomModalComponent,
    RouteComponent,
    MainMenuModalComponent,
    SelectItemComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatDialogModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    DataService,
    AppService,
    CardUtilService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
