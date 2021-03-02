import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/_models/Pagination';

@Component({
  selector: 'pagination-page-selector',
  templateUrl: './pagination-page-selector.component.html',
  styleUrls: ['./pagination-page-selector.component.scss']
})
export class PaginationPageSelectorComponent<T> implements OnChanges {
  @Input() paginationData: Pagination<T>;

  pageNumbers: Array<number>;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paginationData.currentValue) { this.pageNumbers = new Array(this.paginationData.lastPage).fill(0).map((val, index) => index + 1); console.log('this is set for pagenubers, ', this.paginationData) }
  }

  goToPage(pageNumber: number) {
    let currentQParams = { ...this.route.snapshot.queryParams }
    currentQParams.page = pageNumber
    this.router.navigate(['./'], {relativeTo: this.route, queryParams: currentQParams})
  }

  ngOnInit(): void {

  }

}
