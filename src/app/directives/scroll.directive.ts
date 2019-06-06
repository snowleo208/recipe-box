import { Directive, ElementRef, Output, HostListener, OnInit, EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Directive({
    selector: '[scroll-div]'
})

export class ScrollDir implements OnInit {
    @Output() debounceScroll = new EventEmitter();
    private data = new Subject();
    private subscription: Subscription;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.subscription = this.data.pipe(
            debounceTime(200)
        ).subscribe((e: any) => {
            // console.log(e);
            this.debounceScroll.emit(e);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event) {
        event.preventDefault();
        event.stopPropagation();
        this.data.next(event);
    }
}