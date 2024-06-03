import { OnChanges, Directive, OnDestroy, Renderer2, model } from '@angular/core';

@Directive({
  selector: '[cdtClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnChanges, OnDestroy {
  toggle = model<boolean>(false);
  private unlistnerMousedown: () => void = () => null;

  constructor(private readonly renderer2: Renderer2) {}

  ngOnChanges(): void {
    if (this.toggle()) {
      this.unlistnerMousedown = this.renderer2.listen('document', 'mousedown', () => {
        setTimeout(() => {
          this.toggle.update(() => false);
        }, 200);
      });
    } else {
      this.unlistnerMousedown();
    }
  }

  ngOnDestroy(): void {
    if (this.unlistnerMousedown) {
      this.unlistnerMousedown();
    }
  }
}
