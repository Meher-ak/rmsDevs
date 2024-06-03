import { Renderer2, Directive, ElementRef, OnDestroy, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[cdtIntersectionObserverBase]',
  standalone: true,

})
export class IntersectionObserverBaseDirective implements AfterViewInit, OnDestroy {
  intersectionObserver?: IntersectionObserver;
  @Input() options: IntersectionObserverInit | undefined;

  private get getOptions(): IntersectionObserverInit | undefined {
    return this.options;
  }
  set setOptions(options: IntersectionObserverInit | undefined) {
    this.options = options;
  }

  constructor(
    public readonly el: ElementRef,
    public readonly renderer: Renderer2,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.listenToIntersection();
  }

  listenToIntersection() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.checkForIntersection(entries);
    }, this.getOptions);
    this.intersectionObserver.observe(this.el.nativeElement);
  }

  checkForIntersection(entries: Array<IntersectionObserverEntry>) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (this.checkIfIntersecting(entry)) {
        // some logic here
      }
    });
  }

  checkIfIntersecting(entry: IntersectionObserverEntry) {
    return entry.isIntersecting && entry.target === this.el.nativeElement;
  }

  unsubscribe() {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.el.nativeElement);
      this.intersectionObserver.disconnect();
    }
  }
}
