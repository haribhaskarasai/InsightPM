import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil,tap } from 'rxjs';
import { endOfDay, isSameDay, isSameMonth, isThisSecond, startOfDay, startOfMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { Router } from '@angular/router';
import { ParentComponentApi, TasksheetComponent } from '../tasksheet/tasksheet.component';
import { ServiceService } from '../../../services/service.service';
import { TasksheetService } from '../tasksheet/tasksheet.service';
import { DatePipe } from '@angular/common';
import { TsmAlertServiceService } from 'app/services/tsm-alert-service.service';


export class CalendarEventModel {
    data: any
    start: Date;
    end?: Date;
    title: string;
    employeeNo: string
    clientCode: string;
    projectName: string;
    projectCode: string;
    projectType: string;
    holidayType: string;
    clientUserId:string;
    date:string;
    workedHours: number;
    additionalHours: number;
    totalHours: number;
    weeklyTotalHours:number;
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
        location: string,
        notes: string
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
        this.employeeNo = data.employeeNo || '';
        this.projectName = data.projectName || '';
        this.clientUserId = data.clientUserId || '';
        this.projectCode = data.projectCode || '';
        this.projectType = data.projectType || '';
        this.clientCode = data.clientCode || '';
        this.date = data.date || '';
        this.holidayType = data.holidayType || 0;
        this.workedHours = data.workedHours || 0;
        this.additionalHours = data.additionalHours || 0;
        this.weeklyTotalHours=data.weeklyTotalHours || 0;
        this.totalHours = data.totalHours || 0;
        this.workedHoursPrevious=data.workedHours || 0;
        this.editMode = false
        this.color = {
            primary: data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || true,
            afterEnd: data.resizable && data.resizable.afterEnd || true
        };
        this.actions = action || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes: data.meta && data.meta.notes || ''
        };
    }
}


@Component({
  selector: 'app-timesheet-month-view',
  templateUrl: './timesheet-month-view.component.html',
  styleUrls: ['./timesheet-month-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimesheetMonthViewComponent implements OnInit, OnDestroy {

    @Input() timeSheetType:String;
    @Input() projectNameFromUrl:String;
    @Input() employeeNo:string;
    @Input() viewDate: Date
    @Input() showEmployeeDetail:Boolean
    @Input() parentApi: ParentComponentApi
    selectedDay: any;
    view: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    todayDate = new Date();
    moment = moment
    actions: CalendarEventAction[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
    dialogRef: any;
    events: CalendarEvent[];
    refresh: Subject<any> = new Subject();
    sprintIdValue: any = this.tasksheetService.getSprintId();
    calendarMonthViewMap:any = this.tasksheetService.getCalendarMonthMap();

    private _timeSheetMonthView: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    totalWorkedHours:any = this.tasksheetService.getTotalWorkingHours();
  	totalTargetHours:any =this.tasksheetService.getTargetWorkingHours();
    startDate:any = this.tasksheetService.getStartDate();
  	endDate:any =this.tasksheetService.getEndDate();
    sprintSubject:any = this.tasksheetService.getSprint();
    assignmnetId : any = this.tasksheetService.getAssignmnetId();
    assignmnetIdValue:number;
    sprint:any;
  	totalAdditionalHours=0;
    mwlCalendarNextViewDisabled: boolean= true;
    sprintId: any;
    mapForCalendarWorkingHours:Map<any,any> = new Map<any,any>;
    calendarWorkingHours:Map<any,any> = new Map<any,any>;
    checkDate: boolean = false;
    monthStartDate:any;
    monthEndDate:any;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private api :ServiceService,
        private tasksheetService:TasksheetService,
        private datePipe: DatePipe,
        private tmsAlert: TsmAlertServiceService,
    ) {

        if(!this.viewDate){    
            this.viewDate = new Date();
            this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()-1, 1);
            this.selectedDay = {date: startOfDay(this.viewDate)};
        }else{
            this.selectedDay = {date: startOfDay(this.viewDate)};
        }
        this.view='month';
     
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
      //  console.log(this.timeSheetType);
        //console.log(this.projectNameFromUrl);
        this.events=[];
        this.assignmnetId.next(0);
        this.sprintIdValue.next(0);
        this.getHoursOfWorking();
        this.calendarWorkingHours =new Map<any,any>;
        this.calendarMonthViewMap.next(this.calendarWorkingHours);

            // this._timeSheetMonthView.pipe(takeUntil(this._unsubscribeAll))
            // .subscribe((timeDataMonthView: any[]) => {
            //     if (timeDataMonthView && timeDataMonthView.length > 0) {
            //         this.events = []
            //         this.totalWorkedHours =timeDataMonthView[0].totalWorkedHours;
            //         this.totalTargetHours =timeDataMonthView[0].totalTargetHours;
            //         this.totalAdditionalHours=timeDataMonthView[0].totalAdditionalHours;
            //         timeDataMonthView.forEach(element => {
            //             this.events.push(new CalendarEventModel(element, this.actions))
            //         });
            //     } else{
            //         this.events = []
            //     }
            //     this._changeDetectorRef.markForCheck();
            // });

    }
    ngOnChanges(){
        this.selectedDay = {date:this.viewDate}
    }
   
    get _timeSheetMonthView$(): Observable<any> {
        return this._timeSheetMonthView.asObservable();
    }

  

    public setTimeSheetMonthView(value: any) {
        this._timeSheetMonthView.next(value);
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
      }
    


    /**
 * Track by function for ngFor loops
 *
 * @param index
 * @param item
 */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
  
    onViewDateChange(event) {
        this.mwlCalendarNextViewDisabled= this.validateMonthAndYear(this.viewDate)
        this.fetchTimeSheetByEmpAndMonth()
        this.activeDayIsOpen = false;

    }

    validateMonthAndYear(viewDate):boolean{
      let previousMonth = new Date(new Date().getFullYear(), new Date().getMonth()-1, 1);
  
      if(startOfMonth(new Date(viewDate)).getTime() === startOfMonth(previousMonth).getTime()){
        return true
      }
      return false  
    }

    fetchTimeSheetByEmpAndMonth() {
      this.events=[]
     // this.totalWorkedHours.next(0);
     //   this.totalTargetHours =0;
       // this.totalAdditionalHours=0;
        let selectedDate = (this.selectedDay) ? this.moment(this.selectedDay.date).format("YYYYMM") : this.selectedDay;

      
    }
 /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
  beforeMonthViewRender({ header, body }): void {
    /**
     * Get the selected day
     */
    const _selectedDay = body.find((_day) => {
        return _day.date.getTime() === this.selectedDay.date.getTime();
    });

    if (_selectedDay) {
        /**
         * Set selected day style
         * @type {string}
         */
        _selectedDay.cssClass = 'cal-selected';
    }

}

/**
 * Day clicked
 *
 * @param {MonthViewDay} day
 */
dayClicked(day: CalendarMonthViewDay): void {
    this.sprintSubject
        .subscribe(arg => this.sprint = arg);
    const date: Date = day.date;
    if(this.sprint != null){
        var dateFrom =this.datePipe.transform(this.sprint.startDate,'yyyy-MM-dd');
        var dateTo = this.datePipe.transform(this.sprint.endDate,'yyyy-MM-dd');
        var dateCheck = this.datePipe.transform(date,'yyyy-MM-dd');

        var d1 = dateFrom.split("-");
        var d2 = dateTo.split("-");
        // var c = dateCheck.split("-");

        var from = new Date(Number(d1[0]), parseInt(d1[1])-1, Number(d1[2]));  // -1 because months are from 0 to 11
        var to   = new  Date(Number(d2[0]), parseInt(d2[1])-1, Number(d2[2])); 
        // var check = new Date(c[1], parseInt(c[1])-1, c[0]);

        if(date >= from && date <= to){
            this.checkDate = true;
            this.parentApi.callParentMethod(date);
        }else{
            this.tmsAlert.showError("Sprint is not in range")
        }
    }
    
   
}


    cancelEditTimeData(event: CalendarEventModel){
        event.editMode = !event.editMode
        event.workedHours=event.workedHoursPrevious
    }

    saveTimeData(event: CalendarEventModel): void {

        const data = {
            timeSheetType:this.timeSheetType,
            employeeNo: event.employeeNo,
            date: event.date,
            projectCode: event.projectCode,
            clientCode: event.clientCode,
            projectType: event.projectType,
            workedHours: event.workedHours,
            additionalHours:event.additionalHours,
            clientUserId: event.clientUserId,
        }
   
    }

    editTimeData(event: CalendarEventModel): void {
        event.editMode = !event.editMode
    }

    
    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
     editEvent(event: CalendarEvent): void {
      
    }

    /**
     * Add Event
     */
    addEvent(): void {
    }


    /**
     * Calendar Work per Day
     */


    getDataForWorkingHours(){
        let employeeId = JSON.parse(localStorage.getItem('employeeId'));
        this.sprintIdValue.subscribe((a) => {
            this.sprintId = a;
          });
          this.assignmnetId.subscribe((a) => {
            this.assignmnetIdValue = a;
          });
        let data = {
            assignmentId: this.assignmnetIdValue,
            employeId: employeeId,
            projectId: 0,
            sprintId:this.sprintId ,
            taskmasterId: 0
          }
          return data;
    }
 
    getHoursOfWorking(){
        let data = this.getDataForWorkingHours();
        this.api.getWorkingPerDayPresentMonth(data).subscribe(a => {
            this.calendarMapping(a);
        })
    }


    getHoursOfWorkingBySprintId(){
        let data = this.getDataForWorkingHours();
        this.api.getWorkingPerDay(data).subscribe(a => {
            this.calendarWorkingHours.clear();
            this.mapForCalendarWorkingHours.clear();
           this.calendarMappingBySprintId(a);
        })
    }

    calendarMappingBySprintId(a){
        let tragetTime = "";
        let arraySplit = a.totalHoursWorkedPerMonth.split(":");
        tragetTime = arraySplit[0] + ":"+arraySplit[1];
        this.tasksheetService.workingHours.next(tragetTime);
        this.tasksheetService.targetHours.next(a.targetHoursWorkPerMonth);
        this.startDate.next(a.startDate);
        this.endDate.next(a.endDate);
        a.calendarResponseDTOs.forEach( b => {
            let x = ""
            x = b.date;
            let workedDaysTime = ""
            let string1 = b.numOfhoursWorkedPerDay.split(":")
            workedDaysTime = string1[0] + ":" + string1[1];
            this.calendarMonthViewMap.next(
                this.mapForCalendarWorkingHours.set(x,workedDaysTime))
        })
        this.calendarMonthViewMap
                .subscribe(data => this.calendarWorkingHours = data )
        this.startDate.subscribe(x=>this.monthStartDate=x);
        this.endDate.subscribe(x=>this.monthEndDate=x);
    }

    calendarMapping(a){
        let tragetTime = "";
        let arraySplit = a.totalHoursWorkedPerMonth.split(":");
        tragetTime = arraySplit[0] + ":"+arraySplit[1];
        this.totalWorkedHours.next(tragetTime);
        this.totalTargetHours.next(a.targetHoursWorkPerMonth);
        this.startDate.next(a.startDate);
        this.endDate.next(a.endDate);
        if(a.calendarResponseDTOs.length === 0){
            this.calendarWorkingHours.clear();
        }
        a.calendarResponseDTOs.forEach( b => {
            let x = ""
            x = b.date;
            let workedDaysTime = ""
            let string1 = b.numOfhoursWorkedPerDay.split(":")
            workedDaysTime = string1[0] + ":" + string1[1];
            this.calendarMonthViewMap.next(
                this.mapForCalendarWorkingHours.set(x, workedDaysTime))
        })
        this.calendarMonthViewMap
                .subscribe(data => this.calendarWorkingHours = data )
        this.startDate.subscribe(x=>this.monthStartDate=x);
        this.endDate.subscribe(x=>this.monthEndDate=x);
    }
}

