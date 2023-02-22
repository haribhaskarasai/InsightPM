import { DateAdapter } from "@angular/material/core";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
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
} from "rxjs";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  MOMENT,
} from "angular-calendar";
import { endOfDay, isThisQuarter, startOfDay } from "date-fns";
import { th } from "date-fns/locale";
import { UserService } from "app/core/user/user.service";
import {
  FormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { TsmAlertServiceService } from "app/services/tsm-alert-service.service";
import {
  errorJoyPixelsNotLoaded,
  errorSrcWithoutHttpClient,
} from "ngx-markdown";
import { TaskSheet } from "app/modules/admin/createtask/createtask.types";
import { ServiceService } from "app/services/service.service";
import { TasksheetService } from "app/modules/admin/tasksheet/tasksheet.service";
import { TimesheetMonthViewComponent } from "app/modules/admin/timesheet-month-view/timesheet-month-view.component";
import { DatePipe } from "@angular/common";
import { CreatesprintComponent } from "app/modules/admin/createsprint/createsprint.component";
import { CreateuserstoryComponent } from "app/modules/admin/createuserstory/createuserstory.component";
import { ConfirmdialogComponent } from "app/modules/admin/confirmdialog/confirmdialog.component";
import { UserServiceService } from '../user-service.service';

@Component({
  selector: "app-tasklist",
  templateUrl: "./tasklist.component.html",
  styleUrls: ["./tasklist.component.scss"],
})
export class TasklistComponent implements OnInit, AfterViewInit {
  getAllProject() {
    throw new Error("Method not implemented.");
  }
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  viewDetail: boolean = false;
  drawerMode: "side" | "over";
  sprints: any[] = [];
  sprintObs: any=this.tasksheetService.getSprints();
  userstory: any = this.tasksheetService.getUserstory();
  sprintIdValue: any = this.tasksheetService.getSprintId();
  sprintId: any;
  userstoryValue : any = 1;
  project: any[] = [];
  userstories = [];
  selectedSprintStartDate: any;
  selectedSprintEndDate: any;
  tasksforchange: any;
  tasks: any[] = [];
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
  projectForm: any;
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
  selectedTaskEfforts: number;
  calendarWorkingHours: Map<any, any> = new Map<any, any>();
  calendarMonthViewMap: any = this.tasksheetService.getCalendarMonthMap();
  toalworkinghoursInDay: any;
  taskIdset: any;
  assignmentIdset: any;
  employeeData:any = this.userListService.getEmployeeData();
  projectDataEmployee:any = this.userListService.getProjectDataOfEmployee();
  pageSize: any = 10;
  sortingFeild: string = "date";
  showDisable:any = this.userListService.getShowDisable();
  showDisable1: any = false;

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
    private timesheetMonthViewComponent: TimesheetMonthViewComponent,
    private userListService:UserServiceService

  ) {
    this.view = "month";
  }

  ngOnInit(): void {
    this.project=[];
    this.tasks = [];
    this.events = [];
    this.monthlyHours = true;
    this.searchDisable= false;
    this.viewDate = new Date();
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1
    );
    this.totalWorkedHours.subscribe((a) => (this.totalWorkingHours = a));
    this.totalTargetHours.subscribe((a) => (this.tragetWorkingHours = a));
    this._fuseMediaWatcherService
      .onMediaQueryChange$("(min-width: 1440px)")
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((state) => {
        // Calculate the drawer mode
        this.drawerMode = state.matches ? "side" : "over";

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    this.projectForm = this.fb.group({
      project: ["", [Validators.required]],
      sprint: ["", [Validators.required]]
    });

    this.employeeData.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user:any) => {
        this.user = user;
       // this.employeId = user.employeeId;
        this.getAllProjects();
      });
      // this.sprintObs.subscribe({
      //   next: (a: any[]) => {
      //     this.sprints = a;
      //   },
      // });

      this.showDisable
      .subscribe((data:any) => {
        this.showDisable1 = data;
       // this.employeId = user.employeeId;
       // this.getAllProjects();
      });
  }



  /**
   * After view init
   */
  ngAfterViewInit(): void {
    //this.dataSource.paginator = this._paginator;

    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort.sort({
        id: "userstoryName",
        start: "asc",
        disableClear: true,
      });

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // If the user changes the sort order...
      this._sort.sortChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          // Reset back to the first page
          this._paginator.pageIndex = 0;
          // Close the details
          this.closeDetails();
        });

      // Get products if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.closeDetails();
            this.isLoading = true;
            return this.service.getAllTask(this._paginator.pageIndex);
          }),
          map(() => {
            this.isLoading = false;
          })
        )
        .subscribe();
    }
  }

  onChangeProject(deviceValue) {
    this.showDisable1=true;
    this.searchDisable = true;
    this.monthlyHours = true;
    this.disablehours = true;
    this.applicationProject = deviceValue.value;
    this.projectId.next(deviceValue.value.projectId);
    this.service
      .getSprintsById(deviceValue.value.applicationId)
      .subscribe((data) => {
        this.sprintObs.next(data);
      });

    this.sprintObs.subscribe({
      next: (a: any[]) => {
        this.sprints = a;
      },
    });

    let assignmentData = {
      employeeId: this.user.employeeId,
      projectApplicationId : deviceValue.value.applicationId
    }
    this.service.getAssignmentId(assignmentData).subscribe((data) => {
      this.assignmnetId.next(data);
      this.getAllTask(deviceValue.value.projectId);
      this.timesheetMonthViewComponent.getHoursOfWorking();
    });

    if (this.sprints.length != 0) {
      this.isPresent = true;
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
    this.pageSize = event.pageSize
    let data = {
      sprintId: this.sprintId,
      assignmnetId:assignmentIdvalue,
      projectId: projectIdValue,
      startingRecordNumber: event.pageIndex,
      pageSize: this.pageSize,
      sortField: this.sortingFeild,
      sortOrder:this._sort.direction==="asc"?"ASC":"DESC" ,
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
  public  searchDisable:boolean = false;
  totalWorkingHours: any;
  tragetWorkingHours: any;
  targetHours: any;
  workingHours: any;
  disablehours = true;
  monthlyHours = false;

  onSearch() {
    this.showDisable1=true;
    this.disablehours = false;
    this.searchDisable = true;
    this.monthlyHours = false;
    this.tasks = [];
    this.userstories = [];

    this.sprintIdValue.subscribe((a) => {
      this.sprintId = a;
    });
    let assignmentIdvalue: any;
    this.assignmnetId.subscribe((arg) => (assignmentIdvalue = arg));
    let projectIdValue;
    this.projectId.subscribe((arg) => (projectIdValue = arg));
    let data = {
      sprintId: this.sprintId,
      projectId: projectIdValue,
      assignmnetId: assignmentIdvalue,
      employeeId: this.user.employeeId,
      startingRecordNumber: 0,
      pageSize: this.pageSize,
      sortField: this.sortingFeild ,
      sortOrder: this._sort.direction==="asc"?"ASC":"DESC",
    };
    if (this.sprintIdValue != 0) {
      this.service.getAllTask(data).subscribe((data) => {
        this.tasks = data.allTaskDTOs;
        this.count = data.totalCount;
      });
      let sprintId = {
        sprintId: this.sprintId,
      };
      this.service.getSprint(sprintId).subscribe((data) => {
        this.selectedSprintStartDate = data.startDate;
        this.selectedSprintEndDate = data.endDate;
        this.viewDate = new Date(data.startDate);
        this.tasksheetService.workingHours.subscribe((a) => (this.workingHours = a));
        this.tasksheetService.targetHours.subscribe((a) => (this.targetHours = a));
        this.timesheetMonthViewComponent.getHoursOfWorkingBySprintId();
        this.userstory.next(data.userstoryMasters);
        this.userstory.subscribe({
          next: (data) => {
            this.userstories = data;
          },
        });
      });
    }
  }

  taskDetails() {
    this.viewDetail = true;
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
  }

  getAllProjects() {
    this.employeeData
      .subscribe((user:any) => {
        this.user = user; 
      });
      let data = {
        employeeId: this.user.employeeId
      }
      this.service.getAllProject(data).subscribe((data) => {
        this.project = data;
        this.projectDataEmployee.next(this.project);
        this.count=0;
        console.log(this.project.length);
      });
  }

  getAllTask(projectId: any) {
    let assignmentIdvalue: any;
    this.assignmnetId.subscribe((arg) => (assignmentIdvalue = arg));
    let data = {
      sprintId: 0,
      assignmnetId: assignmentIdvalue,
      projectId: projectId,
      employeeId: this.user.employeeId,
      startingRecordNumber: 0 ,
      pageSize: this.pageSize,
      sortField: this.sortingFeild,
      sortOrder: this._sort.direction==="asc"?"ASC":"DESC",
    };
    this.service.getAllTask(data).subscribe((data) => {
      this.tasks = data.allTaskDTOs;
      this.count = data.totalCount;
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
        this.sortingFeild="userstory_name";
       // this.tasks = this.tasks.sort((a,b) => (a.userstoryName < b.userstoryName) ? -1 : ((b.userstoryName > a.userstoryName) ? 1 : 0))
        break;
      case 'taskName':
        this.sortingFeild="task_name";
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
    this.onSearch();
  }
  
}
