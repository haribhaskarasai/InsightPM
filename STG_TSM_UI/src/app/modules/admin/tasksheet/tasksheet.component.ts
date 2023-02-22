import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import {
  Subject,
  takeUntil,
  BehaviorSubject,
  Observable,
  merge,
  switchMap,
  map,
  ReplaySubject,
} from "rxjs";
import {
  TaskList,
  TaskPagination,
  TaskSheet,
} from "../createtask/createtask.types";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  MOMENT,
} from "angular-calendar";
import { endOfDay, isThisQuarter, startOfDay } from "date-fns";
import { CreatesprintComponent } from "../createsprint/createsprint.component";
import { CreateuserstoryComponent } from "../createuserstory/createuserstory.component";
import { ServiceService } from "app/services/service.service";
import { TasksheetService } from "./tasksheet.service";
import { th } from "date-fns/locale";
import { UserService } from "app/core/user/user.service";
import {
  FormBuilder,
  FormControl,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { TsmAlertServiceService } from "app/services/tsm-alert-service.service";
import {
  errorJoyPixelsNotLoaded,
  errorSrcWithoutHttpClient,
} from "ngx-markdown";
import { TimesheetMonthViewComponent } from '../timesheet-month-view/timesheet-month-view.component';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { User } from 'app/core/user/user.types';
import { MatTableDataSource } from '@angular/material/table';
import { RoleFunction } from 'app/common/role-function';



export class CalendarEventModel {
  data: any;
  start: Date;
  end?: Date;
  title: string;
  employeeNo: string;
  clientCode: string;
  projectName: string;
  projectCode: string;
  projectType: string;
  holidayType: string;
  clientUserId: string;
  date: string;
  workedHours: number;
  additionalHours: number;
  totalHours: number;
  weeklyTotalHours: number;
  workedHoursPrevious: number;
  editMode?: boolean;
  color: {
    primary: string;
    secondary: string;
  };
  actions?: CalendarEventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: {
    location: string;
    notes: string;
  };

  /**
   * Constructor
   *
   * @param data
   */
  constructor(data?, action?) {
    this.data = data || {};
    this.start = new Date(data.date) || startOfDay(new Date());
    this.end = new Date(data.date) || endOfDay(new Date());
    this.employeeNo = data.employeeNo || "";
    this.projectName = data.projectName || "";
    this.clientUserId = data.clientUserId || "";
    this.projectCode = data.projectCode || "";
    this.projectType = data.projectType || "";
    this.clientCode = data.clientCode || "";
    this.date = data.date || "";
    this.holidayType = data.holidayType || 0;
    this.workedHours = data.workedHours || 0;
    this.additionalHours = data.additionalHours || 0;
    this.weeklyTotalHours = data.weeklyTotalHours || 0;
    this.totalHours = data.totalHours || 0;
    this.workedHoursPrevious = data.workedHours || 0;
    this.editMode = false;
    this.color = {
      primary: (data.color && data.color.primary) || "#1e90ff",
      secondary: (data.color && data.color.secondary) || "#D1E8FF",
    };
    this.draggable = data.draggable;
    this.resizable = {
      beforeStart: (data.resizable && data.resizable.beforeStart) || true,
      afterEnd: (data.resizable && data.resizable.afterEnd) || true,
    };
    this.actions = action || [];
    this.allDay = data.allDay || false;
    this.cssClass = data.cssClass || "";
    this.meta = {
      location: (data.meta && data.meta.location) || "",
      notes: (data.meta && data.meta.notes) || "",
    };
  }
}
export interface ParentComponentApi {
  callParentMethod: (date) => void;
}
@Component({
  selector: "app-tasksheet",
  templateUrl: "./tasksheet.component.html",
  styleUrls: ["./tasksheet.component.scss"],
})
export class TasksheetComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  viewDetail: boolean = false;
  drawerMode: "side" | "over";
  sprints: any[] = [];
  sprintObs: any;
  userstory: any = this.tasksheetService.getUserstory();
  sprintIdValue: any = this.tasksheetService.getSprintId();
  sprintId: any;
  userstoryValue: any = 1;
  project: any[] = [];
  userstories = [];
  selectedSprintStartDate: any;
  selectedSprintEndDate: any;
  tasksforchange: any;
  tasks: any[];
  showTask: boolean = false;
  tasksheet: TaskSheet[];
  tagsEditMode: boolean = false;
  events: CalendarEvent[];
  activeDayIsOpen: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  viewDate: Date;
  view: string;
  refresh: Subject<any> = new Subject();
  selectedTask: any;
  selectedDate: any = null;
  applicationProject: any;
  taskmasterForm: any;
  projectForm: UntypedFormGroup;
  activityForm: UntypedFormGroup;
  updateActivityForm: UntypedFormGroup;
  contactsCount: number;
  totalRecords: number;
  pageSizeOptions: any;
  isPresent = true;
  isLoading: any;
  sprint: any = this.tasksheetService.getSprint();
  selectedProduct: any;
  dataSource: any;
  totalWorkedHours: any = this.tasksheetService.getTotalWorkingHours();
  totalTargetHours: any = this.tasksheetService.getTargetWorkingHours();
  user: any;
  assignmnetId: any = this.tasksheetService.getAssignmnetId();
  projectId: any = this.tasksheetService.getProjectId();
  employeId: any = null;
  application: any[];
  selectedTaskEfforts: any;
  calendarWorkingHours: Map<any, any> = new Map<any, any>;
  calendarMonthViewMap: any = this.tasksheetService.getCalendarMonthMap(); toalworkinghoursInDay: any;
  pageSize: number = 10;

  taskIdset: any;
  assignmentIdset: any;
  activity = [];
  roleFunction = RoleFunction;
  sortingFeild: any = "date";
  public activityFilterCtrl: FormControl = new FormControl();
  public filteredactivity: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public hrs = [];
  public mins = ["00", "15","30","45"];
  protected _onDestroy = new Subject<void>();
  startingRecordNumber: number = 0;
  constructor(
    private _router: Router,
    private service: ServiceService,
    public dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private tasksheetService: TasksheetService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _userService: UserService,
    private fb: FormBuilder,
    private tmsAlert: TsmAlertServiceService,
    private timesheetMonthViewComponent: TimesheetMonthViewComponent,
    private datepipe: DatePipe,
    
  ) {  
    this.view = "month";
  }
  getParentApi(): ParentComponentApi {
    return {
      callParentMethod: (date) => {
        this.addActivity(date);
      },
    };
  }

  ngOnInit(): void {
    this.timesheetMonthViewComponent.calendarWorkingHours.clear();
    this.events = [];
    this.viewDate = new Date();
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1
    );
    this.totalWorkedHours.subscribe(a => this.totalWorkingHours = a);
    this.totalTargetHours.subscribe(a => this.tragetWorkingHours = a);
    this._fuseMediaWatcherService
      .onMediaQueryChange$("(min-width: 1440px)")
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((state) => {
        // Calculate the drawer mode
        this.drawerMode = state.matches ? "side" : "over";

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    this.activityForm = this.fb.group({
      userstoryId: ["", [Validators.required]],
      date: ["", [Validators.required]],
      activity: ["", [Validators.required]],
      efforts: ["", [Validators.required]],
    });

    this.activityFilter();

    this.updateActivityForm = this.fb.group({
      activity: ["", [Validators.required]],
      efforts: ["", [Validators.required]],
    });

    this._userService.user$
      .pipe((takeUntil(this._unsubscribeAll)))
      .subscribe((user: any) => {
        this.user = user;
        this.employeId = user.employeeId;
        this.getAllProjects();
      });

   
    // this.projectFormData();

    this.activityFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterActivity();
    });
    this.hrsData();
  }
  projectFormData(){
    this.projectForm = this.fb.group({
      project: ['', [Validators.required]],
      sprint: ['', [Validators.required]]
    });
  
  }
  protected filterActivity() {
    if (!this.activity) {
      return;
    }
    // get the search keyword
    let search = this.activityFilterCtrl.value;
    if (!search) {
      this.filteredactivity.next(this.activity.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredactivity.next(
      this.activity.filter(bank => bank.description.toLowerCase().indexOf(search) > -1)
    );
  }
  hrsData() {
    for (let i = 0; i <= 23; i++) {
      this.mins.forEach(minute => {
        let str;
        if(i<10){
          str = `0${i}:${minute}`+":00" ;
        }else{
          str = `${i}:${minute}`+":00";
        }
        this.hrs.push(str);
      });
     
    }
    this.hrs.shift();
  }

  

  onChangeProject(deviceValue) {
    this.applicationProject = deviceValue;
    this.sprintObs = this.tasksheetService.getSprints();
    this.projectId.next(deviceValue.projectId);
    this.service
      .getSprintsById(deviceValue.applicationId)
      .subscribe((data) => {

        this.sprintObs.next(data);
      });
    this.getAllActivitesByProject(deviceValue.projectId);
    this.sprintObs.subscribe({
      next: (a: any[]) => {
        this.sprints = a;
      },
    });

    let assignmentData = {
      employeeId: this.user.employeeId,
      projectApplicationId: deviceValue.applicationId
    }
    this.service.getAssignmentId(assignmentData).subscribe(data => {
      this.assignmnetId.next(data);
      this.getAllTask(deviceValue.projectId);
      this.timesheetMonthViewComponent.getHoursOfWorking();
      
    })


    if (this.sprints.length != 0) {
      this.isPresent = true;
      this.searchDisable = true;
    } else {
      this.isPresent = false;
    }
    this.sprintIdValue.next(0);

  }


  change(event: PageEvent) {
    let assignmentIdvalue: any;
    this.assignmnetId.subscribe(arg => assignmentIdvalue = arg);
    this.tasks = []
    this.sprintIdValue.subscribe((a) => {
      this.sprintId = a;
    });
    let projectIdValue;
    this.projectId.subscribe(arg => projectIdValue = arg);
    this.pageSize = event.pageSize;
    this.startingRecordNumber =event.pageIndex;
    let data = {
      sprintId: this.sprintId,
      assignmnetId: assignmentIdvalue,
      projectId: projectIdValue,
      startingRecordNumber: this.startingRecordNumber,
      pageSize: this.pageSize,
      sortField: this.sortingFeild,
      sortOrder: this._sort.direction === "asc" ? "ASC" : "DESC",
    };
    this.service.getAllTask(data).subscribe((data) => {

      this.tasks = [];
      this.tasks = data.allTaskDTOs;
    });
  }

  onChangeSprint(event) {
    this.isPresent = false;
    this.sprintIdValue.next(event.value.sprintId);
    this.sprint.next(event.value);
  }

  toggleDetails() {
    this.viewDetail = !this.viewDetail;
  }
  count: any;
  searchDisable = true;
  disablehours = true;
  totalWorkingHours: any;
  tragetWorkingHours: any;

  targetHours: any;
  workingHours: any;

  onSearch() {
    this.searchDisable = false;
    this.disablehours = false;

    this.tasks = [];
    this.userstories = [];
    this.sprintIdValue.subscribe((a) => {
      this.sprintId = a;
    });
    let assignmentIdvalue: any;
    this.assignmnetId.subscribe(arg => assignmentIdvalue = arg);
    let projectIdValue;
    this.projectId.subscribe(arg => projectIdValue = arg);
    let data = {
      sprintId: this.sprintId,
      projectId: projectIdValue,
      assignmnetId: assignmentIdvalue,
      employeeId: this.user.employeeId,
      startingRecordNumber: this.startingRecordNumber,
      pageSize: this.pageSize,
      sortField: this.sortingFeild,
      sortOrder: this._sort.direction === "asc" ? "ASC" : "DESC",
    };

    if (this.sprintIdValue != 0) {
      this.service.getAllTask(data).subscribe((data) => {

        this.tasks = data.allTaskDTOs;
        this.count = data.totalCount;
      });
      let sprintId = {
        sprintId: this.sprintId,
      };
      if(sprintId.sprintId != 0){
        this.service.getSprint(sprintId).subscribe((data) => {
          this.selectedSprintStartDate = data.startDate;
          this.selectedSprintEndDate = data.endDate;
          this.viewDate = new Date(data.startDate);
          this.tasksheetService.workingHours.subscribe(a => this.workingHours= a)
          this.tasksheetService.targetHours.subscribe(a => this.targetHours = a);
          this.timesheetMonthViewComponent.getHoursOfWorkingBySprintId();
          this.userstory.next(data.userstoryMasters);
          this.userstory.subscribe((data) => {
              this.userstories = data;
            },
          );
  
        });
      }
    }
  }

  addActivity(date) {
    this.viewDetail = true;
    this.selectedDate = date;
  }

  taskDetails() {
    this.viewDetail = true;
  }

  saveActivity() {
console.log(this.activityForm.value.efforts)
    let assignmentIdvalue: any;
    this.assignmnetId.subscribe(arg => assignmentIdvalue = arg);

    if (this.selectedDate == MOMENT) {
      this.selectedDate = this.activityForm.value.date._d;
    }
    this.calendarMonthViewMap
      .subscribe(data => this.calendarWorkingHours = data)
    this.toalworkinghoursInDay = this.calendarWorkingHours.get(this.datepipe.transform(this.activityForm.value.date, 'YYYY-MM-dd'))
    if (this.toalworkinghoursInDay === undefined || this.toalworkinghoursInDay === null || this.toalworkinghoursInDay < 0) {
      this.toalworkinghoursInDay = 0
    }
    //let efforts = this.activityForm.value.efforts.split + this.toalworkinghoursInDay;

    let newHours:number = this.activityForm.value.efforts.split(":")[0];
    let newMins:number = this.activityForm.value.efforts.split(":")[1];
    
    let totalHours:number =this.toalworkinghoursInDay != 0? this.toalworkinghoursInDay.split(":")[0] : 0;
    let totalMins:number = this.toalworkinghoursInDay != 0? this.toalworkinghoursInDay.split(":")[1] : 0;

    let mins:number = Number(newMins) + Number(totalMins); 

    let efforts:number = Number(newHours) + Number(totalHours);
    efforts += mins/60 
    mins %= 60;

    if (efforts<24) {
      this.taskmasterForm = {
        assignmentId: assignmentIdvalue,
        createdBy: this.user.employeeName,
        createdDate: new Date(),
        date: this.selectedDate,
        efforts: this.activityForm.value.efforts,
        taskName: this.activityForm.value.activity,
        updatedBy: "",
        updatedDate: "",
        userStoryId: this.activityForm.value.userstoryId,
      };
      this.service.createActivity(this.taskmasterForm).subscribe(
        (data) => {
          this.tmsAlert.showSuccess("Effort Added Sucessfully!!");
          this.onSearch();
          this.activityForm.reset();
          this.viewDetail = false;
          this.timesheetMonthViewComponent.getHoursOfWorking();
          this.timesheetMonthViewComponent.getHoursOfWorkingBySprintId();
        },

        (error) => {
          if (error.status === 404 || error.status === 500) {
            this.tmsAlert.showError("Effort Not Added");
          }
        }

      );
    }else{
      this.tmsAlert.showError("You can't add more than 24 hours in a day");
    }

  }

  updateActivity() {
    let assignmnetIdValue;
    this.assignmnetId.subscribe((a) => {
      assignmnetIdValue = a;
    });
    this.calendarMonthViewMap
      .subscribe(data => this.calendarWorkingHours = data)
    this.toalworkinghoursInDay = this.calendarWorkingHours.get(this.datepipe.transform(this.selectedTask.date, 'YYYY-MM-dd'));
    //let efforts = this.updateActivityForm.value.efforts + this.toalworkinghoursInDay - this.selectedTask.efforts;
    
    let newHours:number = this.updateActivityForm.value.efforts.split(":")[0];
    let newMins:number = this.updateActivityForm.value.efforts.split(":")[1];
    
    let totalHours:number = this.toalworkinghoursInDay.split(":")[0];
    let totalMins:number = this.toalworkinghoursInDay.split(":")[1];
    
    let selectedHours:number = this.selectedTask.efforts.split(":")[0];
    let selectedMins:number = this.selectedTask.efforts.split(":")[1];
    
    let mins:number = Number(newMins) + Number(totalMins) - Number(selectedMins) ; 

    let efforts:number = Number(newHours) + Number(totalHours) - Number(selectedHours) ;
    efforts += mins/60 
    mins %= 60;
    if (efforts < 24) {
      this.taskmasterForm = {
        assignmentId: assignmnetIdValue,
        taskId: this.selectedTask.taskId,
        date: this.selectedTask.date,
        efforts: this.updateActivityForm.value.efforts,
        taskName: this.updateActivityForm.value.activity,
        updatedBy: this.user.employeeName,
        updatedDate: new Date(),
        userStoryId: this.selectedTask.userstoryId,
      };
      this.service.updateActivity(this.taskmasterForm).subscribe((data) => {
        this.tmsAlert.showSuccess("Updated Sucessfully");
        this.viewDetail = false;
        this.onSearch();
        this.activityForm.reset();
        this.timesheetMonthViewComponent.getHoursOfWorking();
        this.timesheetMonthViewComponent.getHoursOfWorkingBySprintId();
        this.selectedTask = {};
      });
    }else{
      this.tmsAlert.showError("You can't add more than 24 hours in a day");
    }

  }
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(["./"], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }



  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedProduct = null;
  }

  cancel() {
    this.viewDetail = false;
    this.selectedTask = null;
    this.updateActivityForm.reset();
    this.activityForm.reset();
  }

  openDialog() {
    if (this.applicationProject != null) {
      const dialogRef = this.dialog.open(CreatesprintComponent, {
        data: {
          data: {
            projectId: this.applicationProject.projectId,
            applicationId: this.applicationProject.applicationId,
            user:this.user,
            sprints:this.sprints
          },
        },
      });

      dialogRef.afterClosed().subscribe((result) => { });
    } else {
      this.tmsAlert.showSuccess("Please select the project");
    }
  }

  openDialogUser() {
    const dialogRef = this.dialog.open(CreateuserstoryComponent, {
     // height:"70vh",
      data: {
        data: {
          projectId: null,
          applicationId: null,
         user:this.user
        },
      },
     });
     dialogRef.afterClosed().subscribe((result) => { }); 
    }
    

      editOpenDialog(){}
  /**
   * Toggle the tags edit mode
   */
  toggleTagsEditMode(): void {
    this.tagsEditMode = !this.tagsEditMode;
  }
  /**
   * Day clicked
   *
   * @param {MonthViewDay} day
   */
  dayClicked(day: CalendarMonthViewDay): void {
    this.refresh.next(null);
  }

  editDetail(task: any) {
    this.selectedTask = task;
    this.selectedTaskEfforts = task.efforts;
    this.updateActivityForm.get('efforts').setValue(task.efforts)
  }



  getAllProjects() {
    let data = {
      employeeId: this.user.employeeId
    }
    this.service.getAllProject(data).subscribe((data) => {
      this.project = data;
      this.count = 0;
      let project1 = data[0];
      if(this.project.length!= null){
      this.projectForm = this.fb.group({
        project: ['', [Validators.required]],
        sprint: ['', [Validators.required]]
      });
      this.projectForm.get('project').setValue(this.project[0]);
      this.onChangeProject( this.projectForm.get('project').value);
    }else{
      this.projectForm = this.fb.group({
        project: ['', [Validators.required]],
        sprint: ['', [Validators.required]]
      });
    }
    });

  }

  getAllTask(projectId: any) {
    let assignmentIdvalue: any;
    this.assignmnetId.subscribe(arg => assignmentIdvalue = arg);

    let data = {
      sprintId: 0,
      assignmnetId: assignmentIdvalue,
      projectId: projectId,
      employeeId: this.user.employeeId,
      startingRecordNumber: this.startingRecordNumber,
      pageSize: this.pageSize,
      sortField: this.sortingFeild,
      sortOrder: this._sort.direction === "asc" ? "ASC" : "DESC",
    };
    this.service.getAllTask(data).subscribe((data) => {
      this.tasks = data.allTaskDTOs;
      this.count = data.totalCount;
    });
  }


  deleteTask(task) {
    this.service.deleteTask(task.taskId).subscribe((data) => {
      this.onSearch();
      this.tmsAlert.showSuccess("Deleted Successfully");
      this.timesheetMonthViewComponent.getHoursOfWorking();
      this.timesheetMonthViewComponent.getHoursOfWorkingBySprintId();
    });
  }

  openDelete(task) {
    const confirmDialog = this.dialog.open(ConfirmdialogComponent, {
      // width: "40vw",
      // height: "20vh",

      data: {
        title: 'Confirm Remove Employee',
        message: 'Are you sure, you want to remove an subject: ' + this.tasks
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteTask(task);
      }
    });
  }

  /**
   * Sorting Functions 
     */
  getAllTaskUserstoryName(sortFeild) {
    switch (sortFeild) {
      case 'date':
        this.sortingFeild = "date";
        //this.tasks = this.tasks.sort((a,b) => (a.date > b.date) ? -1 : ((b.date < a.date) ? 1 : 0))
        break;
      case 'userstoryName':
        this.sortingFeild = "userstory_name";
        // this.tasks = this.tasks.sort((a,b) => (a.userstoryName < b.userstoryName) ? -1 : ((b.userstoryName > a.userstoryName) ? 1 : 0))
        break;
      case 'taskName':
        this.sortingFeild = "task_name";
        // this.tasks = this.tasks.sort((a,b) => (a.taskName < b.taskName) ? -1 : ((b.taskName > a.taskName) ? 1 : 0))
        break;
      case 'efforts':
        this.sortingFeild = "efforts";
        // this.tasks = this.tasks.sort((a,b) => (a.efforts < b.efforts) ? -1 : ((b.efforts > a.efforts) ? 1 : 0))
        break

      default:
        this.sortingFeild = "date";
        break;
    }
    if (!this.searchDisable) {
      this.onSearch();
    }else{
      this.onSearch();
      this.searchDisable = true;
      this.disablehours = true;
    }

  }
  applyFilter(event: Event) {
    this.dataSource = new MatTableDataSource(this.tasks);
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(){
    this.projectForm.markAllAsTouched();
    Object.keys(this.projectForm.controls).forEach(key => {
      this.projectForm.get(key).setErrors(null) ;
  });
  // this.projectFormData();
    this.count = 0;
    this.searchDisable = true;
    this.disablehours = true;  
    this.sprintIdValue.next(null);
    this.assignmnetId.next(0);
    this.timesheetMonthViewComponent.ngOnInit();
     this.tasks = [];
   //  this.events = [];
    this.viewDate = new Date();
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1
    );
  }

  demo(){
    return false;
  }

  getAllActivitesByProject(projectId:number){
    let data = {
      projectId : projectId
    }
    this.service.getActivitiesByProject(data).subscribe((data => {
      this.activity = data
      this.filteredactivity.next(this.activity);
      
    }))
  }
  activityFilter(){
    this.activityFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterActivity();
    });
  }

}
