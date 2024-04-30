import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AppService} from '../../services/app-service';
import {AlignmentType_e, SelectItem, SubAlignmentType_e} from '../../interfaces/interfaces';

@Component({
  selector: 'app-main-menu-modal',
  template: `

    <div class="modal-background" (click)="$app.openMainMenuModal = false;">
      <div class="modal _main-menu">
        <div class="modal-scroll-container">
          <div class="modal-scroll-container-content">
            <div class="menu-title">{{ 'app.language' | translate }}</div>
            <app-select-item [selectItem]="languageSelect"
                             (onChange)="onLanguageChange($event)">
            </app-select-item>
            <div class="menu-title">{{ 'app.allignment' | translate }}</div>
            <app-select-item [selectItem]="alignmentSelect"
                             (onChange)="onAlignmentChange($event)">
            </app-select-item>
            <div class="menu-title">
              {{ 'app.challengeDecks' | translate }}
            </div>
            <app-select-item [selectItem]="challengeDecksSelect"
                             (onChange)="onAlignmentChange($event)">
            </app-select-item>
          </div>
        </div>
      </div>
    </div>

  `,
})

export class MainMenuModalComponent {

  constructor(
    public $data: DataService,
    public $app: AppService,
  ) {
  }

  public onLanguageChange($event: any) {
    this.$app.changeAppLanguage($event?.selected ?? null)
    this.$data.refreshCalculations();
    setTimeout(() => {
      this.$app.openMainMenuModal = false;
    }, 600)
  }

  public onAlignmentChange($event: any) {
    this.$data.currentGuiContext_persistent.currentAlignment = $event?.selected ?? AlignmentType_e.Hero;
    if (this.$data.currentGuiContext_persistent.currentAlignment === AlignmentType_e.Fallen_wizard) {
      this.$data.currentGuiContext_persistent.currentSubAlignment_1 = SubAlignmentType_e.hero_fallen_wizard;
      this.$data.currentGuiContext_persistent.currentSubAlignment_2 = SubAlignmentType_e.hero_fallen_wizard;
    }
    this.$data.refreshCalculations();
    setTimeout(() => {
      this.$app.openMainMenuModal = false;
    }, 600)
  }

  public languageSelect: SelectItem = {
    available: this.$app.availableAppLanguages,
    selected: this.$app.getCurrentAppLanguage(),
  }

  public alignmentSelect: SelectItem = {
    available: [
      AlignmentType_e.Hero,
      AlignmentType_e.Minion,
      AlignmentType_e.Fallen_wizard,
      AlignmentType_e.Balrog],
    selected: this.$data.currentGuiContext_persistent.currentAlignment,
  }

  public challengeDecksSelect: SelectItem = {
    available: [
      AlignmentType_e.Challenge_Deck_A,
      AlignmentType_e.Challenge_Deck_B,
      AlignmentType_e.Challenge_Deck_C,
      AlignmentType_e.Challenge_Deck_D,
      AlignmentType_e.Challenge_Deck_E,
      AlignmentType_e.Challenge_Deck_F,
      AlignmentType_e.Challenge_Deck_G,
      AlignmentType_e.Challenge_Deck_H,
      AlignmentType_e.Challenge_Deck_I,
      AlignmentType_e.Challenge_Deck_J,
      AlignmentType_e.Challenge_Deck_K,
      AlignmentType_e.Challenge_Deck_L,
      AlignmentType_e.Challenge_Deck_M,
      AlignmentType_e.Challenge_Deck_N,
      AlignmentType_e.Challenge_Deck_O,
      AlignmentType_e.Challenge_Deck_P,
      AlignmentType_e.Challenge_Deck_Q,
      AlignmentType_e.Challenge_Deck_R,
      AlignmentType_e.Challenge_Deck_S,
      AlignmentType_e.Challenge_Deck_T,
      AlignmentType_e.Challenge_Deck_U,
      AlignmentType_e.Challenge_Deck_V,
    ],
    selected: this.$data.currentGuiContext_persistent.currentAlignment,
  }
}
