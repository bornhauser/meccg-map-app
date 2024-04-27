import {Injectable} from '@angular/core';
import {Card_i, LanguageId_e} from '../interfaces/interfaces';
import {TranslateService} from '@ngx-translate/core';
import {DataService} from './data.service';

@Injectable()
export class AppService {
  public translationsAreLoaded = false;
  public availableAppLanguages: string[] = [LanguageId_e.en, LanguageId_e.de];
  public haveModalReversed: boolean = false;
  public openSiteSelectionModal: boolean = false;
  public openHazardCardsModal: boolean = false;
  public openRegionsModal: boolean = false;
  public openMainMenuModal: boolean = false;
  public openSubAlignmentModal_1: boolean = false;
  public openSubAlignmentModal_2: boolean = false;
  public openExtraMovementModal: boolean = false;
  public mapIsDradding: boolean = false;
  public zoomCard: Card_i | null = null;
  public $data: DataService | null = null;

  constructor(
    private translate: TranslateService,
  ) {
    // @ts-ignore
    document['onSiteOrRegionClick'] = (card: Card_i, event: any) => {
      if (card && !this.mapIsDradding) {
        this.$data?.onSiteOrRegionClick(card);
      }
    }
  }

  public initAppService(): void {
    this.translate.addLangs(this.availableAppLanguages);
    let defaultLanguage = LanguageId_e.en;
    this.translate.setDefaultLang(defaultLanguage);
    const storedLanguageId = localStorage.getItem('app-language') as LanguageId_e;
    if (storedLanguageId && this.availableAppLanguages.indexOf(storedLanguageId) !== -1) {
      defaultLanguage = storedLanguageId;
    }
    this.translate.use(defaultLanguage).subscribe(() => {
      localStorage.setItem('app-language', defaultLanguage);
    }, err => {
    }, () => {
      this.translationsAreLoaded = true;
    });
  }

  public changeAppLanguage(languageId: LanguageId_e | string | null): void {
    if (languageId && this.availableAppLanguages.indexOf(languageId) !== -1) {
      this.translate.use(languageId);
      localStorage.setItem('app-language', languageId);
    }
  }

  public getCurrentAppLanguage(shortVersion?: boolean): LanguageId_e | string {
    let language = this.translate.currentLang as LanguageId_e | string;
    if (!language) {
      language = LanguageId_e.de;
    }
    if (shortVersion) {
      language = language.substring(0, language.length - 1);
    }
    return language;
  }
}
