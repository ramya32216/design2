import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RestApiService } from 'src/app/services/rest-api.service';
import { API_ConfirmVerification } from 'src/environments/api-endpoint';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-signup-email-redirect',
  templateUrl: './signup-email-redirect.component.html',
  styleUrls: ['./signup-email-redirect.component.scss']
})
export class SignupEmailRedirectComponent implements OnInit {
  member_invite_auth_token:string = '';
  member_invite_email_token:string = '';
  member_invite_store_token:string = '';
  token:string;
  auth:string;
  emailActiveStatus:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restApiservice: RestApiService,
    private alertservice: AlertService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.member_invite_auth_token = params['auth_token'];
      this.member_invite_email_token = params['email_token'];
      this.member_invite_store_token = params['store_token'];
      this.token = params['token'];
      this.auth = params['auth'];
    });
    var data={
      'auth':this.auth,
      'token':this.token
    }
    this.alertservice.showLoader();
      this.restApiservice.putData(API_ConfirmVerification, data).pipe(
        finalize(() => this.alertservice.hideLoader())
      ).subscribe(
        (resp: any) => {
          if (resp && resp.success && resp.data) {
            this.emailActiveStatus = 'confirm';
          }
        },(err) => {
          console.log(err.error.errors);
          this.emailActiveStatus = 'expired';
        }
      )
   }

  ngOnInit(): void {
  }

  navigateToLogin(){
    if(this.member_invite_auth_token && this.member_invite_email_token && this.member_invite_store_token){
      this.router.navigateByUrl('/login?auth_token='+this.member_invite_auth_token+'&email_token='+this.member_invite_email_token+'&store_token='+this.member_invite_store_token);
    }else{
      this.router.navigateByUrl('/login');
    }
  }
}
