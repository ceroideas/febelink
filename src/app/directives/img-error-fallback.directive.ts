import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImgErrorFallback], ion-img[appImgErrorFallback]'
})
export class ImgErrorFallbackDirective {

  @Input() appImgErrorFallback: string | undefined;

  constructor(private elementRef: ElementRef) { }

  @HostListener('error')
  @HostListener('ionError')
  loadFallbackImgOnError() {
    const element: HTMLImageElement = <HTMLImageElement>this.elementRef.nativeElement;
    element.src = this.appImgErrorFallback || 'assets/imgs/4.jpg';
  }

}
