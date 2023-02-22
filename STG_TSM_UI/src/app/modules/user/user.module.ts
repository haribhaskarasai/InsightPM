import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './useredit/useredit.component';
import { UserListComponent } from './userlist/userlist.component';
import { RouterModule } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { AddUserComponent } from './adduser/adduser.component';
import { userRoutes } from './user.routing';
import { TasklistComponent } from './tasklist/tasklist.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectAssignmentComponent } from './project-assignment/project-assignment.component';
import { BrowserModule } from '@angular/platform-browser';
import { UsersearchPipe } from './usersearch.pipe';
import { PasswordMeterComponent } from './password-meter/password-meter.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { UserRoleDirective } from 'app/core/auth/directives/user-role.directive';

@NgModule({
  declarations: [
    UserEditComponent,
    UserListComponent,
    AddUserComponent,
    TasklistComponent,
    ProjectAssignmentComponent,
    UsersearchPipe,
    PasswordMeterComponent,
    EditprofileComponent,
    UserRoleDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    RouterModule.forChild(userRoutes),

  ],
  providers: [
      UserListComponent,
      TasklistComponent]

})
export class UserModule { }