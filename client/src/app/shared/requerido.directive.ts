import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appRequerido]'
})
export class RequeridoDirective {

  constructor(renderer: Renderer, el: ElementRef) {
    renderer.setElementStyle(el.nativeElement, 'color', 'red');
  }

}
