import { Output, Renderer2, Directive, ElementRef, EventEmitter, input } from '@angular/core';
import { IntersectionObserverBaseDirective } from './intersection-observer-base.directive';

@Directive({
  selector: '[cdtEnteredToViewport]',
  standalone: true,
})
export class EnteredToViewportDirective extends IntersectionObserverBaseDirective {
  @Output('cdtEnteredToViewport')
  intersected: EventEmitter<boolean> = new EventEmitter<boolean>();
  unsubscription = input<boolean>(true);

  constructor(
    override readonly el: ElementRef,
    override readonly renderer: Renderer2,
  ) {
    super(el, renderer);
  }

  override checkForIntersection(entries: Array<IntersectionObserverEntry>) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (this.checkIfIntersecting(entry)) {
        this.intersected.emit(true);
        this.unsubscription() && this.unsubscribe();
      } else {
        this.intersected.emit(false);
      }
    });
  }
}
