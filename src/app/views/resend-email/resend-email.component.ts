import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { REQUEST_A_ACTIVE } from 'src/environments/environment';
import { RestApiService } from 'src/app/services/rest-api.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { API_ResendVerification } from 'src/environments/api-endpoint';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.html',
  styleUrls: ['./resend-email.component.scss']
})
export class ResendEmailComponent implements OnInit {
  emailAddress: string;
  returnUrl: string;
  resendSignupEmail: FormGroup;
  resendemailSubmit = false;
  ResendemailError = false;
  errors = new Array();

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private restApiservice: RestApiService,
    private alertservice: AlertService,
    private authenticateService: AuthenticationService
  ) { }

  ngOnInit(): void {
    let Email=localStorage.getItem("email");
    this.emailAddress= Email;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    var obj = this;
    if(localStorage.getItem('Audit_Auth') && localStorage.getItem('loggedUser')){
      this.router.navigateByUrl('/dashboard');
      //obj.authenticateService.checkExpiryStatus();
    }
    this.resendSignupEmail = this.formBuilder.group({
      resendemail: [null, [Validators.required, Validators.pattern('^[a-z0-9.]+@[a-z0-9.]+\\.[a-z]{2,4}$')]],
    });
  }
  get f() { return this.resendSignupEmail.controls;}

  resendEmail() {
    this.resendemailSubmit = true;
    if (this.resendSignupEmail.invalid) {
      return;
    }
    if(this.resendSignupEmail.valid){
      let data={
        'email':this.resendSignupEmail.value.resendemail,
        'url':environment['mail_url_success'],
      }; 
      this.alertservice.showLoader();
      this.restApiservice.patchData(API_ResendVerification, data).pipe(
        finalize(() => this.alertservice.hideLoader())
      ).subscribe(
        (resp: any) => {
          if (resp && resp.success && resp.data) {
            this.alertservice.showNotification('Successfully sent mail. Please check your mailbox','success');
            this.alertservice.hideLoader();
            return this.router.navigateByUrl('/confirm-singup');
          }
        },(err) => {
          for(let key in err.error.errors) {
            this.errors[key]= err.error.errors[key][0];
            if(key=="message"){
             this.alertservice.showNotification(this.errors[key],'error');
            }
           }
        }
      )
    }
  }

  removeError(field){
    this.errors[field] = null;
  }

}
