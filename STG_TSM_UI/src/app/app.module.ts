import { MatSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { EmployeeListComponent } from './modules/admin/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './modules/admin/employee-detail/employee-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateTaskComponent } from './modules/admin/createtask/createtask.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from './services/service.service';
import { CreatesprintComponent } from './modules/admin/createsprint/createsprint.component';
import { TasksheetComponent } from './modules/admin/tasksheet/tasksheet.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SprintMasterComponent } from './modules/admin/sprint-master/sprint-master.component';
import { FuseCardModule } from '@fuse/components/card';
import { CreateuserstoryComponent } from './modules/admin/createuserstory/createuserstory.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import moment from 'moment';
import { TimesheetMonthViewComponent } from './modules/admin/timesheet-month-view/timesheet-month-view.component';
import { NextMonthWeeklyTotalHoursPipe, TotalHours, WeeklyTotalHoursPipe } from './modules/admin/timesheet-month-view/SSNFormat.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ConfirmdialogComponent } from './modules/admin/confirmdialog/confirmdialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRoleDirective } from './core/auth/directives/user-role.directive';

import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';




const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        EmployeeListComponent,
        EmployeeDetailComponent,
        CreateTaskComponent,
        CreatesprintComponent,
        SprintMasterComponent,
        TasksheetComponent,
        CreateuserstoryComponent,
        TimesheetMonthViewComponent,
        TotalHours,
        WeeklyTotalHoursPipe,
        NextMonthWeeklyTotalHoursPipe,
        ConfirmdialogComponent,
   
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseCardModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
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
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
          }),
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        MatSelectFilterModule,
        NgxMatSelectSearchModule 
    ],
    providers: [ServiceService,
      MatSnackBar,
      TimesheetMonthViewComponent,
      DatePipe ,
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
              parse: {
                dateInput: moment.ISO_8601
              },
              display: {
                dateInput: 'DD MMM YYYY',
                monthYearLabel: 'MMM YYYY',
                dateA11yLabel: 'LL',
                monthYearA11yLabel: 'MMM YYYY'
              }
            }
          }],
         
          
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
