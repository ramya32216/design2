import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Pagination } from 'src/app/_models/Pagination';

@Component({
  selector: 'pagination-data',
  templateUrl: './pagination-data.component.html',
  styleUrls: ['./pagination-data.component.scss']
})
export class PaginationDataComponent<T> implements OnInit {
  @Input() source: (query: { [key: string]: string }) => Observable<Pagination<T>>;
  @Output() data = new EventEmitter<Pagination<T>>();
  @Input() foo: Pagination<T>

  unSub$ = new Subject<true>();
  
  constructor(private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(q => this.source(q))
    ).pipe(takeUntil(this.unSub$)).subscribe(
      (p) => this.data.emit(p)
    )
  }

  onDestroy(){
    this.unSub$.next(true);
    this.unSub$.complete();
  }

}
