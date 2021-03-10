import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpageeight',
  templateUrl: './landingpageeight.component.html',
  styleUrls: ['./landingpageeight.component.scss']
})
export class LandingpageeightComponent implements OnInit {
ishow:boolean=false;
ishow1:boolean=false;
ishow2:boolean=false;
ishow3:boolean=false;

  constructor() { }

  ngOnInit(): void {
  }
gold(){
this.ishow=!this.ishow;
}
gold1(){
  this.ishow1=!this.ishow1;
}
gold2(){
this.ishow2=!this.ishow2;
}
gold3(){
this.ishow3=!this.ishow3;
}
}
