import {Component, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-underdeeps-svg',
  template: `<span [innerHTML]="svg"></span>`,
})
export class UndergroundSvgComponent {

  public svg: any;
  @Output() svgIsReady = new EventEmitter<void>();

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
    this.httpClient
      .get(`assets/img/map/underdeeps.svg`, { responseType: 'text' })
      .subscribe(value => {
        this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
        setTimeout(()=>{
          this.svgIsReady.emit();
        },500)
      });
  }
}
