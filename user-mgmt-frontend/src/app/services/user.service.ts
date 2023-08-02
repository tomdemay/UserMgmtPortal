import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../entities/user';
import { BehaviorSubject, Observable, catchError, filter, mergeMap, of } from 'rxjs';
import { StatusInfo } from 'src/app/entities/status-info';
import { Users } from '../entities/users';
import { PageInfo } from 'src/app/entities/page-info';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as constants from 'src/app/constants';


/**
 * @description Interface for the raw users object returned from the server.
 * @property _embedded: { users: User[] } - The users array.
 * @property page: PageInfo - The pagination information.
 */
interface rawUsers {
    _embedded: {
        users: User[]
    },
    page: PageInfo
}

/**
 * @description This service is used for User CRUD operations with a REST server
 *            using the HttpClient.
 */
@Injectable({
    providedIn: 'root'
})
export class UserService implements OnInit {

    ngOnInit(): void {

    }

    /**
     * @description The form used for adding and editing users.
     *              It is used by the user-form component.
     * TODO: This is a good area for improvement. Currently the list
     *       component and the form component are tightly coupled.
     *       The list component should not maintain the list of users
     *       to make it easier for other components to subscribe to the list.
     */
    public form: FormGroup = new FormGroup({
        $id: new FormControl(null),
        firstName: new FormControl('', [Validators.required, Validators.maxLength(constants.firstNameLength)]),
        lastName: new FormControl('', [Validators.required, Validators.maxLength(constants.lastNameLength)]),
        address: new FormControl('', [Validators.required, Validators.maxLength(constants.addressLength)]),
        city: new FormControl('', [Validators.required, Validators.maxLength(constants.cityLength)]),
        state: new FormControl('', [Validators.required, Validators.pattern(constants.stateRegex)]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern(constants.zipCodeRegex)]),
        phone: new FormControl('', [Validators.pattern(constants.usPhoneRegex)]),
        email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
        dob: new FormControl('', [Validators.required, Validators.pattern(constants.dateRegex)]),
        ssn: new FormControl('', [Validators.required, Validators.pattern(constants.ssnRegex)]),
        picture: new FormControl('', [Validators.pattern(constants.urlRegex)])
    })

    /**
     * @description The status information for the last operation as a subscribable observable.
     *              components can subscribe to this to get the status and progress information.
     *             The status information is also stored in the statusInformation property.
     *             The statusInformation property is used primarily by the status-information component.
     */
    private statusInformation = new BehaviorSubject<StatusInfo>({
        progress: 0,
        status: HttpStatusCode.Ok,
        messages: [],
        timeStamp: new Date()
    });
    statusInformation$ = this.statusInformation.asObservable();

    /** @description The status information for the last operation as an event emitter
     *               This may seem redundant to the observable above.
     *               This one is used by the status-information component
     *               to alert subscribers when a user cancels an upload or
     *               when upload has been completed. the list component relies on this
     *               event to refresh the list of users.
     **/
    public recordsDownloadedEvent = new EventEmitter<StatusInfo>();

    constructor(private http: HttpClient) { }

    /**
     * @description Constructs a StatusInfo object with the status code 500 and the message
     * "Internal Server Error" or what ever message is passed in.
     * @param message The message to be included in the StatusInfo object.
     *                Defaults to "Internal Server Error".
     * @returns StatusInfo object with the status code 500 and the message
     */
    private constructInternalServerErrorStatusInfo(message: string = "Internal Server Error"): StatusInfo {
        return {
            progress: undefined,
            status: HttpStatusCode.InternalServerError,
            messages: [message],
            timeStamp: new Date()
        };
    }

    /**
     * @description Constructs a StatusInfo object with the status code 200 and "Success" as the message.
     * @returns StatusInfo object with the status code 200 and "Success" as the message.
     */
    private constructOkStatusInfo(): StatusInfo {
        return {
            progress: 100,
            status: HttpStatusCode.Ok,
            messages: ['Success'],
            timeStamp: new Date()
        };
    }

    /**
     * @description nHandles the HttpErrorResponse object and returns a StatusInfo object.
     * @param error the HttpErrorResponse object to be handled.
     * @returns statusInfo object with the status code and message from the error.
     */
    private handleHttpErrorEvent(error: any): StatusInfo {
        let result: StatusInfo;
        if (error.status == 0) {
            result = this.constructInternalServerErrorStatusInfo();
        } else {
            result = error.error as StatusInfo;
        }
        console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
        return result;
    }

    /**
     * @description Handle progress events and return a StatusInfo object.
     * @param event the event with the progress information.
     * @param action what action is this being used for. "Get User" or "File Upload"
     * @returns the StatusInfo object with the progress information.
     */
    private handleProgressEvent(event: any, action: string): StatusInfo {
        let progress: number = Math.round(100 * event.loaded / event.total);
        return progress < 100
            ? { progress: progress, status: HttpStatusCode.Accepted, messages: [`${action} in progress: Progress: ${progress}%...`], timeStamp: new Date() }
            : { progress: progress, status: HttpStatusCode.Processing, messages: [`${action} complete: Waiting for results...`], timeStamp: new Date() };
    }
    /**
     * @description Handle get users events and return a Users object.
     * @param event the event. It could be an error, progress or response (Users) event.
     * @returns an Observable of Users or undefined in case of an error, progress or unexpected event.
     */
    private handleGetUsersEvent(event: any | HttpErrorResponse): Observable<Users | undefined> {
        let statusInfo: StatusInfo | undefined = undefined;
        let users: Users | undefined = undefined;
        if (event instanceof HttpErrorResponse) {
            statusInfo = this.handleHttpErrorEvent(event);
        } else if (event.type == HttpEventType.DownloadProgress && event?.loaded && event?.total) {
            statusInfo = this.handleProgressEvent(event, 'Get Users');
        } else if (event.type == HttpEventType.Response) {
            let responseBody: rawUsers = event.body as rawUsers;
            users = {
                users: responseBody._embedded.users,
                page: responseBody.page
            };
            statusInfo = this.constructOkStatusInfo();
        } else {
          statusInfo = this.statusInformation.getValue();
      }
      if (event instanceof HttpErrorResponse) {
        console.error(event);
      } else {
        console.log(event);
      }
        if (statusInfo) { this.statusInformation.next(statusInfo); }
        return of(users);
    }
    /**
     * @description Handle get user events and return a User object.
     * @param event the event. It could be an error, progress or response (User) event.
     * @returns an observable of User or undefined in case of an error, progress or unexpected event.
     */
    private handleGetUserEvent(event: any | HttpErrorResponse): Observable<User | undefined> {
        let statusInfo: StatusInfo | undefined = undefined;
        let user: User | undefined = undefined;
        if (event instanceof HttpErrorResponse) {
            statusInfo = this.handleHttpErrorEvent(event);
        } else if (event.type == HttpEventType.Response) {
            user = event.body as User;
            statusInfo = this.constructOkStatusInfo();
        } else {
            statusInfo = this.constructInternalServerErrorStatusInfo("Unexpected event received from the server");
        }
        if (statusInfo) { this.statusInformation.next(statusInfo); }
        return of(user);
    }
    /**
     * @description Handle file upload events and return a StatusInfo object.
     * @param event the event. It could be an error, progress or response (StatusInfo) event.
     * @returns an observable of StatusInfo or undefined in case of an error, progress or unexpected event.
     */
  private handleUploadEvent(event: any | HttpErrorResponse): Observable<StatusInfo> {
      let statusInfo: StatusInfo | undefined = undefined;
      if (event instanceof HttpErrorResponse) {
          statusInfo = this.handleHttpErrorEvent(event);
      } else if (event.type == HttpEventType.UploadProgress && event?.loaded && event?.total) {
          statusInfo = this.handleProgressEvent(event, 'File upload');
      } else if (event.type == HttpEventType.Response) {
          statusInfo = event.body as StatusInfo;
      } else if (event.type == HttpEventType.Sent) {
          statusInfo = {
              progress: 0,
              status: HttpStatusCode.Accepted,
              messages: ['File upload started'],
              timeStamp: new Date()
          };
      } else {
        statusInfo = this.statusInformation.getValue();
      }
      if (event instanceof HttpErrorResponse) {
        console.error(statusInfo);
      } else {
        console.log(statusInfo);
      }

      if (statusInfo) { this.statusInformation.next(statusInfo); }
      return of(statusInfo!)
    }
    /**
     * @description Get users from the server.
     * @param page the page number.
     * @param size the size of the page
     * @returns and observable which contains the Users and Page information.
     */
    getUsers(page: number = 0, size: number = environment.defaultPageSize): Observable<Users> {
        return this.http.get<rawUsers>(`${environment.entryPoint}?page=${page}&size=${size}`, {
            observe: 'events',
            reportProgress: true,
            responseType: 'json',
            withCredentials: false,
        })
            .pipe(
                catchError((error: any) => error),
                mergeMap((event: any) => this.handleGetUsersEvent(event)),
                filter((users: Users | undefined) => users != undefined),
                mergeMap((users: Users | undefined) => of(users!))
            );
    }
    /**
     * @description Get a user from the server.
     * @param id the id of the user
     * @returns an observable which contains the User.
     */
    get(id: number): Observable<User> {
        return this.http.get<User>(`${environment.entryPoint}/${id}`, {
            responseType: 'json',
            withCredentials: false,
        })
            .pipe(
                catchError((error: any) => error),
                mergeMap((event: any) => this.handleGetUserEvent(event)),
                filter((user: User | undefined) => user != undefined),
                mergeMap((user: User | undefined) => of(user!))
            );
    }
    /**
     * @description Post a new user to the server (id will be ignored).
     * @param user the user to add to the server.
     * @returns the added user with the id assigned by the server.
     */
    post(user: User): Observable<User> {
        user.$id = undefined;
        return this.http.post<User>(`${environment.entryPoint}`, user, {
            responseType: 'json',
            withCredentials: false,
        })
            .pipe(
                catchError((error: any) => error),
                mergeMap((event: any) => this.handleGetUserEvent(event)),
                filter((user: User | undefined) => user != undefined),
                mergeMap((user: User | undefined) => of(user!))
            );
    }
    /**
     * @description Upload a csv file to the server.
     * @param file the csv file to upload.
     * @returns an observable of StatusInfo.
     */
    upload(file: File): Observable<StatusInfo> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<StatusInfo>(`${environment.entryPoint}/upload-csv`, formData, {
            observe: 'events',
            reportProgress: true,
            responseType: 'json',
            withCredentials: false,
        })
            .pipe(
                catchError((error: any) => this.handleUploadEvent(error)),
                mergeMap((event: any) => this.handleUploadEvent(event))
            );
    }
}

