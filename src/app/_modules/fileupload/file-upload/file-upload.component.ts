import { AfterViewInit, Component, ContentChild, ElementRef, HostListener, ViewChild, EventEmitter, Output, Input, Renderer2, TemplateRef, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnDestroy {

  constructor(private renderer: Renderer2) { }

  @ViewChild('fileInput', { read: ElementRef }) fileInput: ElementRef;

  @HostListener('click')
  onClick() {
    if (this.accept) this.renderer.setAttribute(this.fileInput.nativeElement, 'accept', this.accept.toString())
    this.fileInput.nativeElement.click();
  }

  @Input() validators: Array<(file: File) => string | null>;
  @Input() accept: Array<string>;
  @Input() uploadApiFunction: (file: File) => Observable<string>;
  @Input() asyncValidators: Array<(file: File) => Observable<boolean>>;
  @Output() error = new EventEmitter<string>();
  @Output() file = new EventEmitter<File>();
  @Output() url = new EventEmitter<string>();

  unSub$ = new Subject<true>();

  initiateFileUpload() {
    this.fileInput.nativeElement.click();
  }

  // onFileChanged(event) {
  //   /* File upload Required function */
  //   let fileToUpload = event.target.files[0];
  //   if (fileToUpload) {
  //     if (this.validators) {
  //       for (let i = 0; i < this.validators.length; i++) {
  //         const validation = this.validators[i](fileToUpload);
  //         if (validation) {
  //           this.error.emit(validation)
  //           return;
  //         }
  //       }
  //     }

  //     if (this.uploadApiFunction) {
  //       this.uploadApiFunction(fileToUpload).subscribe(
  //         (url) => this.url.emit(url)
  //       )
  //     }
  //     else this.file.emit(fileToUpload);
  //     this.fileInput.nativeElement.value = '';
  //   }
  // }

  onFileChanged(event) {

    let fileToUpload = event.target.files[0];
    if (fileToUpload) {
      if (this.validators) {
        for (let i = 0; i < this.validators.length; i++) {
          const validation = this.validators[i](fileToUpload);
          if (validation) {
            this.error.emit(validation)
            return;
          }
        }
      }

      if (this.asyncValidators && this.asyncValidators.length > 0) {
        forkJoin(this.asyncValidators.map(v => v(fileToUpload))).pipe(takeUntil(this.unSub$)).subscribe(
          (res) => {
            if (this.uploadApiFunction) {
              this.uploadApiFunction(fileToUpload).pipe(takeUntil(this.unSub$)).subscribe(
                (url) => this.url.emit(url)
              )
            }
            else this.file.emit(fileToUpload);
          },
          (res) => this.error.emit(res)
        )
      } else {
        if (this.uploadApiFunction) {
          this.uploadApiFunction(fileToUpload).pipe(takeUntil(this.unSub$)).subscribe(
            (url) => this.url.emit(url)
          )
        }
        else this.file.emit(fileToUpload);
      }

    }
    this.fileInput.nativeElement.value = '';
  }

  ngOnDestroy(): void {
    this.unSub$.next(true);
    this.unSub$.complete();
  }
}