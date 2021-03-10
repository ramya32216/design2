import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpagesix',
  templateUrl: './landingpagesix.component.html',
  styleUrls: ['./landingpagesix.component.scss']
})
export class LandingpagesixComponent implements OnInit {
  selectedFile: File;
  selectedFileName: string;
  legalFile: string;
  checkownershipSubmit = false;
  constructor() { }

  ngOnInit(): void {
  }
  onFileChanged(event) {
    // this.selectedFile = event.target.files[0];
    // if (this.selectedFile) {
    //   this.selectedFileName = this.selectedFile.name;
    //   this.legalFile = '';
  //  }
  }
}
