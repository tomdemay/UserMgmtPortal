import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { StatusInfo } from 'src/app/entities/status-info';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})

export class UploadCsvComponent implements OnInit, OnDestroy {


  @Input()
  requiredFileType: string = '';

  message: string = '';
  statusInfo!: StatusInfo;
  uploadSubscription?: Subscription;
  private statusInfoSubScription!: Subscription;

  ngOnInit(): void {
    this.statusInfoSubScription = this.service.statusInformation$.subscribe((statusInfo: StatusInfo) => {
      this.statusInfo = statusInfo;
    });
  }

  ngOnDestroy(): void {
    this.statusInfoSubScription.unsubscribe();
  }

  reset(): void {
    this.message = '';
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    if (this.statusInfoSubScription) {
      this.statusInfoSubScription.unsubscribe();
    }
    this.uploadSubscription = undefined;
    this.statusInfoSubScription = Subscription.EMPTY;
  }

  cancel() {
    this.reset();
    // TODO: need a process for some kind of cancel interrupter.
    // I tried with HttpInterceptor, but I didn't get very far.
    // all this cancel operation does is unsubscribe from the
    // statusInfo observable.  The upload is still in progress.
    // If this went into production we would need a mechanism
    // to interrupt the back end from processing the upload.
    // NOTE: This doesn't really unsubscribe that well either.
    // it's supposed to stop the component from getting
    // subscription events by unsubscribing from the observable.
    // But it still gets events.

    //this.service.cancel();
    this.statusInfo = {
      progress: 0,
      status: HttpStatusCode.NoContent,
      messages: [`Progress canceled.`],
      timeStamp: new Date()
    };
  }

  constructor(public service: UserService) { }

  uploadFile(event: any): void {
    if ((event.target.files.length ?? 0) == 1) {
      let file: File = event.target.files[0];
      this.message = file.name;
      this.service.upload(file)
        .subscribe((response: any) => {
          let statusInfo = response as StatusInfo;
          this.message = statusInfo.messages.join(', ');
          if (statusInfo.status == HttpStatusCode.Ok) {
            this.service.recordsDownloadedEvent.emit(statusInfo);
          }
      });
    }
  }
}
