import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AppService} from '../../services/app-service';
import {AlignmentType_e, SelectItem} from '../../interfaces/interfaces';

@Component({
  selector: 'app-main-menu-modal',
  template: `

    <div class="modal-background" (click)="$app.openMainMenuModal = false;">
      <div class="main-menu-modal">
        <div class="menu-title">{{ 'app.edition' | translate }}</div>
        <app-select-item [selectItem]="currentAlignment"
                         (onChange)="onAlignmentChange($event)">
        </app-select-item>
        <div class="menu-title">{{ 'app.language' | translate }}</div>
        <app-select-item [selectItem]="currentLanguage"
                         (onChange)="onLanguageChange($event)">
        </app-select-item>
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

  public onLanguageChange($event: any){
    this.$data.resetCurrentGuiContext();
    this.$app.changeAppLanguage($event?.selected ?? null)
    this.$app.refreshMapContent();
    setTimeout(()=>{
      this.$app.openMainMenuModal = false;
    },300)
  }

  public onAlignmentChange($event: any){
    this.$data.resetCurrentGuiContext();
    this.$data.currentGuiContext.currentAlignment = $event?.selected ?? AlignmentType_e.Hero;
    this.$app.refreshMapContent();
    setTimeout(()=>{
      this.$app.openMainMenuModal = false;
    },300)
  }

  public currentLanguage: SelectItem = {
    available: this.$app.availableAppLanguages,
    selected: this.$app.getCurrentAppLanguage(),
  }

  public currentAlignment: SelectItem = {
    available: [AlignmentType_e.Hero, AlignmentType_e.Minion, AlignmentType_e.Balrog],
    selected: this.$data.currentGuiContext.currentAlignment,
  }
}
