import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AppService} from '../../services/app-service';
import {SelectItem, SubAlignmentType_e} from '../../interfaces/interfaces';

@Component({
  selector: 'app-sub-alignment-select-modal',
  template: `

    <div class="modal-background" (click)="close()">
      <div class="modal _sub-alignment">
        <div class="modal-scroll-container">
          <div class="modal-scroll-container-content">
            <div class="menu-title">{{ 'app.supAlignment' | translate }}</div>
            <app-select-item *ngIf="subAlignmentSelect"
                             [selectItem]="subAlignmentSelect"
                             (onChange)="onSubAlignmentChange($event)">
            </app-select-item>
          </div>
        </div>
      </div>
    </div>

  `,
})

export class SubAlignmentSelectModalComponent implements OnInit {

  @Input() public key: 1 | 2 | null = null;
  public subAlignmentSelect: SelectItem | null = null;

  constructor(
    public $data: DataService,
    public $app: AppService,
  ) {
  }

  ngOnInit() {
    this.subAlignmentSelect = {
      available: [
        SubAlignmentType_e.hero_fallen_wizard,
        SubAlignmentType_e.minion_fallen_wizard,
        SubAlignmentType_e.hero_default,
        SubAlignmentType_e.minion_default,
      ],
      selected: this.key === 1 ? this.$data.currentGuiContext_persistent.currentSubAlignment_1 : this.$data.currentGuiContext_persistent.currentSubAlignment_2
    }
  }

  public close() {
    if (this.key === 1) {
      this.$app.openSubAlignmentModal_1 = false;
    } else if (this.key === 2) {
      this.$app.openSubAlignmentModal_2 = false;
    }
  }

  public onSubAlignmentChange($event: any) {
    if (this.key === 1) {
      this.$data.currentGuiContext_persistent.currentSubAlignment_1 = $event?.selected ?? SubAlignmentType_e.hero_default;
      if(!this.$data.currentGuiContext_notPersitent.currentJourneySiteTo) {
        this.$data.currentGuiContext_persistent.currentSubAlignment_2 = $event?.selected ?? SubAlignmentType_e.hero_default;
      }
    } else if (this.key === 2) {
      this.$data.currentGuiContext_persistent.currentSubAlignment_2 = $event?.selected ?? SubAlignmentType_e.hero_default;
    }
    this.$data.refreshCalculations();
    setTimeout(() => {
      this.close();
    }, 600)
  }
}
