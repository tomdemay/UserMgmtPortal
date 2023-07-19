import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from './services/user.service';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { UploadCsvComponent } from './users/upload-csv/upload-csv.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent,
    UserListComponent,
    UploadCsvComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // Import HttpClientModule after BrowserModule.
    BrowserAnimationsModule,
    MatButtonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatPaginatorModule
  ],
  exports: [
    MaterialModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
