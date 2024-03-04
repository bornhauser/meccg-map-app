import {Injectable} from '@angular/core';
import {LanguageId_e} from '../interfaces/interfaces';
import {TranslateService} from '@ngx-translate/core';


@Injectable()
export class AppService {
  public translationsAreLoaded = false;
  public appLanguages: string[] = [LanguageId_e.en, LanguageId_e.de];

  constructor(
    private translate: TranslateService,
  ) {
  }

  public initAppService(): void {
    this.translate.addLangs(this.appLanguages);
    let defaultLanguage = LanguageId_e.en;
    this.translate.setDefaultLang(defaultLanguage);
    const storedLanguageId = localStorage.getItem('app-language') as LanguageId_e;
    if (storedLanguageId && this.appLanguages.indexOf(storedLanguageId) !== -1) {
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
    if (languageId && this.appLanguages.indexOf(languageId) !== -1) {
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
