import { Component, Input, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  UntypedFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceService } from "../../../services/service.service";
import { ProjectAssignment } from "../ProjectAssignmnet";
import { UserServiceService } from "../user-service.service";
import { lists } from "../../../mock-api/apps/scrumboard/data";
import { UserService } from "app/core/user/user.service";
import { takeUntil } from "rxjs";
import { TsmAlertServiceService } from "app/services/tsm-alert-service.service";
import { UserListComponent } from "../userlist/userlist.component";
import { TasklistComponent } from "../tasklist/tasklist.component";

@Component({
  selector: "app-project-assignment",
  templateUrl: "./project-assignment.component.html",
  styleUrls: ["./project-assignment.component.scss"],
})
export class ProjectAssignmentComponent implements OnInit {
  projectAssignmentForm: FormGroup;
  applicationsData: FormArray;
  @Input() assignedProjectLength;
  applications: any = [];
  projects: any = [];
  pro:any[]=[];
  user: any;
  count:any;
  projectAssignments:any=[];
  employeeData: any = this.userListService.getEmployeeData();
  projectEmployeeData: any = this.userListService.getProjectDataOfEmployee();
  projectsEmployee: any = [];
  loginedUser: any;
  choosenPath: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: ServiceService,
    private _userService: UserService,
    private tsmAlertService: TsmAlertServiceService,
    private userListService: UserServiceService,
    private userList: UserListComponent,
    private tasklistComponent: TasklistComponent,
    private _userList: UserListComponent,
  ) {}

  ngOnInit() {
    this.getAllProjects();
   this.getAllPro();
    this.projectAssignmentForm = this.formBuilder.group({
      assignments: this.formBuilder.array(
        [this.createItem()],
        this.isApplicationDup()
      ),
    });

    this.applicationsData = this.projectAssignmentForm.get(
      "assignments"
    ) as FormArray;
  }
  project(): FormArray {
    return this.projectAssignmentForm.get("assignments") as FormArray;
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      projects: ["", [Validators.required]],
      applications: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      billable: ["", [Validators.required]],
    });
  }

  addItem(): void {
    this.applicationsData.push(this.createItem());
  }

  removeItem(i: number) {
    this.project().removeAt(i);
  }

  isApplicationDup() {
    const validator: ValidatorFn = (assignments: FormArray) => {
      const totalSelected = assignments.controls.map(
        (control) => control.value
      );
      const names = totalSelected.map((value) => value.applications);
      const hasDuplicate = names.some(
        (name, index) => names.indexOf(name, index + 1) != -1
      );
      return hasDuplicate ? { duplicate: true } : null;
    };
    return validator;
  }
  getSkillFormGroup(index: string | number): FormGroup {
    const formGroup = this.applicationsData.controls[index] as FormGroup;
    return formGroup;
  }

  onChangeProject(deviceValue, i) {
    this.applications[i] = this.projects.filter(
      (x) => x.projectId == deviceValue
    )[0].projectApplicationDetails;
    const formGroup = this.getSkillFormGroup(i);
    const choosenPath = formGroup.controls["projects"].value;
    this.choosenPath = choosenPath;
  }

  back() {
    this.router.navigate(["./userlist/edituser"]);
  }

  cancel(){
    this.projectAssignmentForm.reset();
    this._userList.matDrawer.close();
    this.router.navigate(['./userlist']);

  }

  submit() {
    this._userService.user$.subscribe((user) => {
      this.loginedUser = user;
    });
    this.employeeData.subscribe((user: any) => {
      this.user = user;
    });
    let projectAssignments: ProjectAssignment[] = [];
    let employeeId = JSON.parse(localStorage.getItem("employeeId"));
    this.projectAssignmentForm.value.assignments.forEach((element) => {
      if(!this.projectValidations(element)){
        let projectAssignmnet: ProjectAssignment = {
          employeeId: this.user.employeeId,
          assignmnetRole: "",
          projectApplicationId: element.applications,
          createdBy: this.loginedUser.employeeName,
          updatedBy: null,
          createdDate: new Date(),
          updatedDate: null,
          billable: element.billable,
          assignmentStartDate: element.startDate._d,
          assignmentEndDate: element.endDate._d,
        };
        projectAssignments.push(projectAssignmnet);
      }else{
        this.tsmAlertService.showError("Project Already Assigned :");
      }
    });
    this.createAssignment(projectAssignments) 
  }

  createAssignment(projectAssignments){
    if(projectAssignments.length != 0){
      this.service.createProjectAsignmnet(projectAssignments).subscribe(
        (data) => {
         this.user.projectAssignments.push(data);
         this.employeeData.next(this.user);
          this.tsmAlertService.showSuccess("Project Assigned");
          this.projectAssignmentForm.reset();
          this.userList.getAllEmployees();
          this.tasklistComponent.getAllProjects();
          this.back();
        },
        (error) => {
          if (error?.status == 500) {
            this.tsmAlertService.showError(
              "Something went wrong project not asigned"
            );
          }
        }
      );
    }
  }

  getAllProjects() {
      this.service.getAllProjects().subscribe((data) => { 
        this.projects = data;
      });
  }
  getAllPro() { 
    this.employeeData
      .subscribe((user:any) => {
        this.user = user;  
      });
    if(this.user){  
      //this._userList.matDrawer.open();
      let data = {
      employeeId :this.user.employeeId,
      }
      this.service.getAllProject(data).subscribe((data) => {
        console.log(data); 
        this.pro = data;
        this.count=this.pro.length;
      }); }
 else{
  this.router.navigate(['./userlist']);
 }
  }

  projectValidations(value):Boolean{
    let check = false;
    this.projectEmployeeData.subscribe((user: any[]) => {
      this.projectsEmployee = user;
      this.projectsEmployee.forEach(element => {
        if (element.applicationId === value.applications) {  
          check = true;
        } 
      });
    }); return check;
  }
  check:boolean = false;
  checkProjectAssigned(value){
    this.check = false;
    this.projectEmployeeData.subscribe((user: any[]) => {
      this.projectsEmployee = user;
      this.projectsEmployee.forEach(element => {
        if (element.applicationId === value) {  
          this.check = true;
        } 
      });
    }); return this.check
  }
   submitForm(formData: any, formDirective: FormGroupDirective): void {
    formDirective.resetForm();
    this.projectAssignmentForm.reset();
    this.projectAssignmentForm = this.formBuilder.group({
      assignments: this.formBuilder.array(
        [this.createItem()],
        this.isApplicationDup()
      ),
    });
    this.applicationsData = this.projectAssignmentForm.get(
      "assignments"
    ) as FormArray;

}
}
