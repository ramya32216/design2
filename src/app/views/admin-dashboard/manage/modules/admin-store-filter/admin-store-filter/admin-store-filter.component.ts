import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, interval, Subscription } from 'rxjs';
import { debounce, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'admin-store-filter',
  templateUrl: './admin-store-filter.component.html',
  styleUrls: ['./admin-store-filter.component.scss']
})
export class AdminStoreFilterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() termName: string;
  @Input() typeName: string;
  @Input() types: Array<string>;
  @ViewChild('termInput', { read: ElementRef }) termInput: ElementRef;

  keyupSubs: Subscription;
  currentStatusSelection: string;

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnDestroy(): void {
    this.keyupSubs.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.keyupSubs = fromEvent(this.termInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        distinctUntilChanged(),
        debounce(() => interval(500)),
      ).subscribe(sTerm => {
        let qParams = { ...this.route.snapshot.queryParams };
        delete qParams.page;
        if (sTerm) qParams[this.termName] = sTerm;
        else delete qParams[this.termName];
        this.router.navigate([], { relativeTo: this.route, queryParams: qParams })
      });
  }

  handleChange(status) {
    let qParams = { ...this.route.snapshot.queryParams };
    delete qParams.page;
    if (status) qParams[this.typeName] = status;
    else delete qParams[this.typeName];

    this.router.navigate([], { relativeTo: this.route, queryParams: qParams })

  }

  ngOnInit(): void {
    this.currentStatusSelection = this.route.snapshot.queryParams.status;
  }

}
