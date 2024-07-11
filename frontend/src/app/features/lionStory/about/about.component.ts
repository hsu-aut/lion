import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {Carousel} from 'bootstrap';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit{

    @ViewChild('carousel') carousel: ElementRef;
    constructor() { }

    ngAfterViewInit(): void {
        const carousel = new Carousel(this.carousel.nativeElement, {
            interval: 2000,
            touch: false,
            ride: 'carousel'
        });

    }

}
