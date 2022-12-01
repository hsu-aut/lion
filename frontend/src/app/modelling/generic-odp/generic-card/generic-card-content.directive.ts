import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[genericCardContent]',
})
export class GenericCardContentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

