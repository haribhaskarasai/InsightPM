import { Component, Inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Sprints } from "../createtask/createtask.types";
import { EmployeeDetailComponent } from "../employee-detail/employee-detail.component";
import { ServiceService } from "../../../services/service.service";
import { UserService } from '../../../core/user/user.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { TasksheetService } from '../tasksheet/tasksheet.service';
import { labels } from '../../../mock-api/apps/mailbox/data';
import { da } from "date-fns/locale";
import { TsmAlertServiceService } from "app/services/tsm-alert-service.service";
import { Subject, takeUntil } from "rxjs";
import { User } from "app/core/user/user.types";
import { DatePipe } from "@angular/common";
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: "app-createsprint",
  templateUrl: "./createsprint.component.html",
  styleUrls: ["./createsprint.component.scss"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class CreatesprintComponent implements OnInit,OnChanges {
  sprints: Sprints[];
  sprintForm: UntypedFormGroup;
  createSprintForm:any;
  projectData:any= this.data.data
  sprintsData:any= this.data.data.sprints;
  sprintObs:any = this.serviceSprints.getSprints();
  user:any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  existsSprints: boolean;
  sprintName: any;
  existsSprintsName: boolean;
  checkDate: boolean;
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EmployeeDetailComponent>,
    private _formBuilder: UntypedFormBuilder,
    private service: ServiceService,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) private data: any ,
    private serviceSprints:TasksheetService,
    private tsmAlertService:TsmAlertServiceService,
    private _userService: UserService,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    
    this.sprintObs.subscribe(data => {
      this.sprints=data
    });

    this.sprintForm = this._formBuilder.group({
      sprintName: ["", [Validators.required]],
      sprintDescription: ["",[Validators.required,Validators.maxLength(100)]],
      startDate: ["", Validators.required],
      endDate: ["",  Validators.required]
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.duplicateSprint();
  }

  
  save() {
    


    this.createSprintForm = {
      sprintName:this.sprintForm.value.sprintName,
      sprintDescription:this.sprintForm.value.sprintDescription,
      startDate:this.sprintForm.value.startDate._d,
      endDate:this.sprintForm.value.endDate._d,
      createdBy:this.projectData.user.userName,
      createdDate:new Date(),
      updatedBy:null,
      updatedDate:null
    }
    this.service.createSprint(this.projectData.projectId,this.projectData.applicationId,this.createSprintForm)
    .subscribe( data => {
      this.sprints.push(data)
      this.sprintObs.next(this.sprints);
      this.tsmAlertService.showSuccess("Sprint is created !!!" )
      this.taskView();
    },(error => {
      if (error?.status == 404){
       this.tsmAlertService.showError("Sprint Not created")
      }
     }))
    

  }
  taskView() {
    this.dialogRef.close();
  }

  duplicateSprint(){
    this.checkDate = false;
      this.sprintsData.forEach(element => {
        var dateFrom = element.startDate;
        var dateTo = element.endDate;
        var dateCheckFrom:String = this.datepipe.transform(this.sprintForm.value.startDate._d, 'YYYY-MM-dd') ;
        var dateCheckTo:String = this.datepipe.transform(this.sprintForm.value.endDate._d, 'YYYY-MM-dd') ;
        if(dateFrom === dateCheckFrom && dateTo === dateCheckTo ){
          this.checkDate = true;
        }
      })
  }
  duplicateSprintName(){
    this.existsSprintsName = false;
    this.sprintsData.forEach(element => {
      if(element.sprintName === this.sprintForm.value.sprintName){
          this.existsSprintsName = true;
          this.sprintName = element.sprintName;
          
      }
    });
  }

  prevent(event){
    event.preventDefault();
   }
}
