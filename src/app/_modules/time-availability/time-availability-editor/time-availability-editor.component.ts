import { Component, OnInit, Output, EventEmitter, Input, TemplateRef, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { TimeAvailability, TimeAvailabilityComp } from '../_model/time-availability';
import { TimeAvailabilityService, TimeFormat } from '../_services/time-availability.service';

@Component({
  selector: 'time-availability-editor',
  templateUrl: './time-availability-editor.component.html',
  styleUrls: ['./time-availability-editor.component.scss']
})
export class TimeAvailabilityEditorComponent implements AfterViewInit {
  @Output() onChange = new EventEmitter<Array<TimeAvailability>>();
  constructor(private timeAvailabilityServ: TimeAvailabilityService) {
    let pref = this.timeAvailabilityServ.getPreference();
    if (pref) {
      this.format24hr = pref === TimeFormat.hrs24 ? true : false;
    } else this.format24hr = false;
  }

  ngAfterViewInit(): void {
    if (this.headingTempalte)
      this.headingSlot.createEmbeddedView(this.headingTempalte);
  }

  format24hr: boolean;

  @Input() headingTempalte: TemplateRef<any>;

  @Input() set availability(a: Array<TimeAvailability>) {
    if (a) this._availability = a;
  }

  @ViewChild('headingSlot', { read: ViewContainerRef }) headingSlot: ViewContainerRef;

  //variables to track status
  touched: boolean = false;
  dirty: boolean = false;

  _availability: Array<TimeAvailability> = [];
  selectedDays: Array<string> = [];

  daysTouched: boolean = false;

  // tou = true;

  // active_add_image:string = "assets/images/ico_add.png";
  // inactive_add_image:string = "assets/images/ico_add_light.png";

  time: Array<string> = [
      '12:00AM'
    , '12:30AM'
    , '1:00AM'
    , '1:30AM'
    , '2:00AM'
    , '2:30AM'
    , '3:00AM'
    , '3:30AM'
    , '4:00AM'
    , '4:30AM'
    , '5:00AM'
    , '5:30AM'
    , '6:00AM'
    , '6:30AM'
    , '7:00AM'
    , '7:30AM'
    , '8:00AM'
    , '8:30AM'
    , '9:00AM'
    , '9:30AM'
    , '10:00AM'
    , '10:30AM'
    , '11:00AM'
    , '11:30AM'
    , '12:00PM'
    , '12:30PM'
    , '1:00PM'
    , '1:30PM'
    , '2:00PM'
    , '2:30PM'
    , '3:00PM'
    , '3:30PM'
    , '4:00PM'
    , '4:30PM'
    , '5:00PM'
    , '5:30PM'
    , '6:00PM'
    , '6:30PM'
    , '7:00PM'
    , '7:30PM'
    , '8:00PM'
    , '8:30PM'
    , '9:00PM'
    , '9:30PM'
    , '10:00PM'
    , '10:30PM'
    , '11:00PM'
    , '11:30PM'
  ]

  timing: FormGroup = new FormGroup({
    startTime: new FormControl('9:00AM'),
    endTime: new FormControl('5:00PM')
  }, this.timingValidator())

  addRemvDay(day: string, add: boolean) {
    this.daysTouched = true;
    if (add) {
      this.selectedDays.push(day);
    } else {
      let index = this.selectedDays.findIndex((selectedDay) => { return selectedDay === day });
      this.selectedDays.splice(index, 1);
    }
  }

  timingValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

      if ((<FormGroup>control).controls.startTime.value == 'Select'
        || (<FormGroup>control).controls.endTime.value == 'Select') return { 'noSelection': 'Start and end time are required' };

      if ((<FormGroup>control).controls.startTime.value == (<FormGroup>control).controls.endTime.value && ((<FormGroup>control).controls.endTime.value !== '12:00AM')) return { 'sameSelection': 'Start and end time can not be the same' };
      return null;
    };
  }

  insertIntoAvailability(availability: Array<TimeAvailability>, timeAvai: TimeAvailability) {
    for (let i = 0; i <= availability.length; i++) {

      //case: menuTime is the largest in the array
      if (i == availability.length) {
        availability.push(timeAvai);
        break;
      }

      let compVal = TimeAvailabilityComp(timeAvai, availability[i]);

      if (compVal < 0) {
        availability.splice(i, 0, timeAvai);
        break;
      }

      //donot insert if there is an identical StoreMenuTime
      if (compVal == 0) break;
    }
  }

  fmt24to12(time: string) {
    let hours = parseInt(time.substr(0, 2));
    let parsedTime: string;
    if (hours > 12) {
      parsedTime = (hours - 12) + time.substr(2, 4) + 'PM';
    } else {
      parsedTime = hours + time.substr(2, 4) + 'AM'
    }
    return parsedTime.length === 4 ? '0' + parsedTime : parsedTime;
  }

  fmt12to24(time: string): string {
    let hours = parseInt(time.substr(0, 2));
    let parsedHours;
    if (time.substr(5, 2) === 'PM') {
      // if (hours === 12) return 12;
      // else return hours + 12;
      parsedHours = (hours === 12 ? 12 : hours + 12) + time.substr(2, 3);
    } else {
      // if (hours === 12) return 0;
      // else return hours;
      parsedHours = (hours === 12 ? 0 : hours) + time.substr(2, 3);
    }
    return parsedHours.length === 4 ? '0' + parsedHours : parsedHours;
  }

  // toggleFormat() {
  //   if (this.format24hr) {
  //     this.format24hr = false;
  //     this.timeAvailabilityServ.setPrefence(TimeFormat.hrs12)
  //   } else {
  //     this.format24hr = true;
  //     this.timeAvailabilityServ.setPrefence(TimeFormat.hrs24)
  //   }
  // }

  addAvailability() {
    this.dirty = true;

    if (this.timing.invalid || this.selectedDays.length == 0) {
      this.timing.markAllAsTouched();
      this.daysTouched = true;
      return;
    }
    this.touched = true;

    let menuTime = null;
    this.selectedDays.forEach(day => {
      menuTime = new TimeAvailability(null, day, this.timing.controls.startTime.value, this.timing.controls.endTime.value, false);
      this.insertIntoAvailability(this._availability, menuTime);
    });

    this.onChange.emit(this._availability);
  }

  timingOnChange(event: any) {
    if (this.timing.controls.startTime.value === '24 Hours' || this.timing.controls.endTime.value === '24 Hours') {
      this.timing.patchValue({ startTime: '12:00AM', endTime: '12:00AM' });
    }
  }

  deleteAvailability(index: number) {
    this.dirty = true;
    this.touched = true;
    this._availability.splice(index, 1)[0];
    this.onChange.emit(this._availability);
  }

}
