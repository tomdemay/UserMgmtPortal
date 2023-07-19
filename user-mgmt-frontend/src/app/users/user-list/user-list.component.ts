import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Users } from 'src/app/entities/users';
import { UserService } from 'src/app/services/user.service';
import { PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { StatusInfo } from 'src/app/entities/status-info';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { User } from 'src/app/entities/user';

/**
 * @title Table with expandable rows
 * @see https://material.angular.io/components/table/examples
 * @description The example demonstrates how to use a table to display a list of users.
 * The table rows can be expanded to reveal additional details.
 * The example uses the following Angular Material components:
 * - MatTable
 * - MatSort
 * - MatPaginator
 * Please forgive my laziness. I was running out of time and
 * didn't bother to rename some of the "example" classes that I
 * borrowed from the Angular Material website.
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class UserListComponent implements AfterViewInit, OnDestroy, OnInit {

  // maintains a list of columns that is interact over to build the usual
  // table columns.  The expandable table has an additional column.
  dataColumns: string[] = ['firstName', 'lastName', 'email', 'phone'];
  displayedColumnsWithExpand = [...this.dataColumns, 'expand' ];
  expandedElement?: User | null;

  // The data that is displayed in the table.
  // The angular components are bound to this member variable.
  userListData: Users = {
    users: [],
    page: {
      size: environment.defaultPageSize,
      totalElements: 0,
      totalPages: 0,
      number: 0
    }
  };

  // page sizes permitted in pagination. I allowed large page sizes
  // to make it easier to test the pagination and demonstrate
  // performance
  pageSizeOptions = [5, 10, 25, 50, 100, 250, 1000];

  // The expandable column options.
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  recordsDownloadedEventSubscription: Subscription = Subscription.EMPTY;

  constructor(private service: UserService) { }

  // set up the subscription to the event that is emitted when the
  // download is complete
  ngOnInit(): void {
    this.recordsDownloadedEventSubscription = this.service.recordsDownloadedEvent.subscribe(
      (statusInfo: StatusInfo) => {
        console.log('event received by the upload component to refresh the list of users: %s', statusInfo);
        this.onGetUsers();
      }
    );
  }

  // clean up
  ngOnDestroy(): void {
    if (this.recordsDownloadedEventSubscription) {
      this.recordsDownloadedEventSubscription.unsubscribe();
    }
  }

  // used for the column headings. we iterate over the camel case
  // column names and convert them to proper case using regex.
  camelToProperCase(str: string): string {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  }

  // formats dates in the table to make them more readable
  formatDate(input: string): string {
    const regex = /(\d{4})-(\d{2})-(\d{2})T.*/;
    const match = input.match(regex);
    if (match) {
        const [, year, month, day] = match;
        return `${day}/${month}/${year}`;
    } else {
      return input;
    }
  }

  // event handler for the pagination control
  handlePageEvent(e: PageEvent) {
    this.userListData.page.number = e.pageIndex;
    this.userListData.page.size = e.pageSize;

    this.service.getUsers(e.pageIndex, e.pageSize)
      .subscribe(
        (userListData: Users) => {
          this.userListData = userListData;
        }
      )
  }

  // event handler for retrieving the list of users
  onGetUsers(): void {
    this.service.getUsers(this.userListData.page.number, this.userListData.page.size)
      .subscribe(
        (userListData: Users) => {
          this.userListData = userListData;
        }
      )
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  // event handler that gets called after the view is initialized.
  ngAfterViewInit(): void {
    this.service.getUsers(this.userListData.page.number, this.userListData.page.size)
      .subscribe(
        (userListData: Users) => {
          this.userListData = userListData;
        }
      )
  }
}
