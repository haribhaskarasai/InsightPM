import { Component, Inject, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { th } from "date-fns/locale";
import { UserStory } from "../createtask/createtask.types";
import { ServiceService } from "../../../services/service.service";
import { TasksheetService } from '../tasksheet/tasksheet.service';
import { UserService } from "app/core/user/user.service";
import { TsmAlertServiceService } from "app/services/tsm-alert-service.service";
import { Subject, takeUntil } from "rxjs";
import { user } from '../../../mock-api/common/user/data';

@Component({
  selector: "app-createuserstory",
  templateUrl: "./createuserstory.component.html",
  styleUrls: ["./createuserstory.component.scss"],
})
export class CreateuserstoryComponent implements OnInit {
  userstory: any[];
  userForm: UntypedFormGroup;
  userstoryObs:any = this.taskService.getUserstory();
  sprintId:any= this.taskService.getSprintId();
  sprintIdValue :any;
  projectData:any= this.data.data
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userstoryName: any;
  existsUserStoryName: boolean;
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateuserstoryComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any ,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private service: ServiceService,
    private taskService:TasksheetService,
    private userService:UserService,
    private tsmAlert:TsmAlertServiceService
  ) {}

  ngOnInit(): void {
    // Create the form
    this.userstoryObs.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.userstory=data
    });
    this.sprintId.subscribe(data => {
      this.sprintIdValue=data;
    });

    this.userForm = this._formBuilder.group({
      userstoryId: ["", [Validators.required]],
      description: ["", [Validators.required]],
      plannedEfforts: [""],
      estimatedStoryPoints: [""],
    });
  }

  save() {
    if(!this.existsUserStoryName){
      let createUserStoryForm = {
        createdBy:this.projectData.user.userName,
        createdDate: new Date(),
        estimatedStorypoints: this.userForm.value.estimatedStoryPoints,
        plannedEfforts: this.userForm.value.plannedEfforts,
        updatedBy: "",
        updatedDate: "",
        userstoryDescription: this.userForm.value.description,
        userstoryName: this.userForm.value.userstoryId,
        sprintId:this.sprintIdValue
      };
      this.api(createUserStoryForm);  
    }else{
      this.tsmAlert.showError("User Story Id is already there "+ this.userstoryName );
    }
   
  }

  api(createUserStoryForm){
    this.service
    .createUserStory( createUserStoryForm)
    .subscribe((data) => {
      this.userstory.push(data);
      this.userstoryObs.next(this.userstory);
      this.tsmAlert.showSuccess("User Story added ");
    },
    (error)=>{
        if (error?.status == 404){
         this.tsmAlert.showError("Something went wrong userstory not added");
        }
    });

  this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
  duplicateSprintName(){
    this.existsUserStoryName = false;
    this.userstoryName  = "";
    this.userstory.forEach(element => {
      if(element.userstoryName === this.userForm.value.userstoryId){
          this.existsUserStoryName = true;
          this.userstoryName = element.userstoryName;
          
      }
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sprintIdValue
  }

  prevent(event){
    event.preventDefault();
   }
}
