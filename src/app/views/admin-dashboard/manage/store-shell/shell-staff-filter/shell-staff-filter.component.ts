import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AdminStoreDataService } from '../../../_services/admin-store-data.service';

@Component({
  selector: 'shell-staff-filter',
  templateUrl: './shell-staff-filter.component.html',
  styleUrls: ['./shell-staff-filter.component.scss']
})
export class ShellStaffFilterComponent implements OnInit {
  staff: Array<{
    store_partner_id: number,
    name: string
  }>;

  selectedStaff: number;

  constructor(private adminData: AdminStoreDataService,
    private router: Router,
    private route: ActivatedRoute) { }

  handleChange(staffId: number) {
    let qParams = { ...this.route.snapshot.queryParams };
    delete qParams.page;

    if (staffId) qParams.shell_user_id = staffId;
    else delete qParams.shell_user_id;
    this.router.navigate([], { relativeTo: this.route, queryParams: qParams })
  }

  ngOnInit(): void {
    this.selectedStaff = parseInt(this.route.snapshot.queryParams.shell_user_id);

    this.adminData.allShellStaff().subscribe(
      s => this.staff = s
    )
  }

}
