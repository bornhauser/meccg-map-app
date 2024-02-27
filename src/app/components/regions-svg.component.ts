import {Component, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-regions-svg',
  template: `<span [innerHTML]="svg"></span>`,
})
export class SvgComponent {

  public svg: any;

  @Output() svgIsReady = new EventEmitter<void>();

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
    this.httpClient
      .get(`assets/img/map/export.svg`, { responseType: 'text' })
      .subscribe(value => {
        this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
        setTimeout(()=>{
          this.svgIsReady.emit();
        },500)
      });
  }
}
