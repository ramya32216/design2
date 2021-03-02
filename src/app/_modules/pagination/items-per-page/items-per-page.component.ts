import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'items-per-page',
  templateUrl: './items-per-page.component.html',
  styleUrls: ['./items-per-page.component.scss']
})
export class ItemsPerPageComponent implements OnInit {
  @Input() options: Array<string>;

  //to sync if any count query param is already applied
  selectedCount: string;


  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.selectedCount = this.route.snapshot.queryParams.count? this.route.snapshot.queryParams.count : '';
    console.log('this is the selected count,',  this.selectedCount)
  }

  handleChange(itemCount: string) {
    let currentQParams = { ...this.route.snapshot.queryParams }

    if (itemCount) currentQParams.count = itemCount;
    else delete currentQParams.count;

    delete currentQParams.page;
    this.router.navigate(['./'], { relativeTo: this.route, queryParams: currentQParams })
  }

}
