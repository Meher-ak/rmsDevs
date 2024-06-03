import { Input, Output, OnChanges, Directive, OnDestroy, Renderer2, EventEmitter } from '@angular/core';

@Directive({
  selector: '[cdtClickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements OnChanges, OnDestroy {
  @Input() toggle = false;
  @Output() toggleChange = new EventEmitter<boolean>();

  private unlistnerMousedown: () => void = () => {};

  constructor(private readonly renderer2: Renderer2) {}

  ngOnChanges(): void {
    if (this.toggle) {
      this.unlistnerMousedown = this.renderer2.listen('document', 'mousedown', () => {
        setTimeout(() => {
          this.toggleChange.emit(false);
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
