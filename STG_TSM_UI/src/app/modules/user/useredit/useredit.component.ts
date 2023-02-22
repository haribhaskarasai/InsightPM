import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Route, Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { UserListComponent } from '../userlist/userlist.component';
import { UserServiceService } from '../user-service.service';
import { formatDate } from '@angular/common';
import { UserService } from 'app/core/user/user.service';
import { TsmAlertServiceService } from 'app/services/tsm-alert-service.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { MustMatch } from 'app/services/password-validator.service';

@Component({
  selector: 'app-useredit',
  templateUrl: './useredit.component.html',
  styleUrls: ['./useredit.component.scss']
})

export class UserEditComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  editMode: boolean = false;
  assignMode: boolean = false;
  employeesForm: UntypedFormGroup;
  matDrawer: any;
  user: any;
  projects: any;
  employeesData: any = this.userService.getEmployeeData();
  projectOfEmployess: any = this.userService.getProjectDataOfEmployee();
  employee: any;
  employeeUpdate: any;
  employeeList: any;
  updatedPassword: any;
  passwordMeter: boolean = true;
  updateEmployees: any;
  presentEmployeeId: number;
  showDisable:any=this.userService.getShowDisable();
 

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _userList: UserListComponent,
    private router: Router,
    private service: ServiceService,
    private userService: UserServiceService,
    private _userService: UserService,
    private tsmAlertService: TsmAlertServiceService,
    private tmsAlert: TsmAlertServiceService,

  ) {
    // Subscribe to the user service
    this._userService.user$
      .pipe((takeUntil(this._unsubscribeAll)))
      .subscribe((user: User) => {
        this.user = user;
      });

  }

  ngOnInit(): void {
    this.editModeSubject();
    this.getAllEmployees();
    this.presentEmployeeId = JSON.parse(localStorage.getItem('employeeId'));
    this.employeFormData();

    //this.getAllProjects();

    // Open the drawer
 
    // Create the contact form
  }

  toggleEditMode(editMode: boolean | null = null): void {
    if (editMode === null) {
      this.editMode = !this.editMode;
    }
    else {
      this.editMode = editMode;
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  /**
    * Close the drawer
    */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._userList.matDrawer.close();
  }

  getAllEmployees() {
    this.service.getAllEmployees().subscribe((data) => {
      this.employeeList = data;
    })
  }

  getAllProjects() {
    this.service.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects)
    });
  }

  back() {
    this._userList.matDrawer.close();
    this.router.navigate(['./userlist']);
  }
  assign() {
    this.router.navigate(['./userlist/projectassignment']);
  }

  // assign(editMode: boolean | null = null) {
  //   if (editMode === null) {
  //     this.assignMode = !this.editMode;
  //   }
  //   else {
  //     this.assignMode = editMode;
  //     this.editMode = !editMode;
  //   }
  //   // Mark for check
  //   this._changeDetectorRef.markForCheck();
  // }
  backToHome(editMode: boolean | null = null) {
    if (editMode === null) {
      this.assignMode = !this.editMode;
    }
    else {
      this.assignMode = editMode;
      this.editMode = editMode;
    }
  }

  get password() {
    return this.employeesForm.get('password');
  }

  changePasswordMeter() {
    this.passwordMeter = !this.passwordMeter
  }

  blurPass: boolean = false
  blurPass1: boolean = false
  blurMethod() {
    this.blurPass = false
  }
  focusMethod() {
    this.blurPass = true
  }

  blurMethod1() {
    this.blurPass1 = false
  }
  focusMethod1() {
    this.blurPass1 = true
  }

  onSubmit() {
    this.updateEmployees = {
      employeeId: this.employee.employeeId,
      employeeName: this.employeesForm.value.employeeName,
      employeeEmail: this.employeesForm.value.emailId,
      newPassword: this.employeesForm.value.password,
      adminId: this.user.employeeId,
      adminName: this.user.employeeName,
      adminEmail: this.user.email,
    }
    this.service.editEmployee(this.updateEmployees).subscribe((data) => {
      this.tmsAlert.showSuccess("Password updated Sucessfully");
      this.employeesForm.reset();
      this.editMode = false
      this.ngOnInit();
    })
  }
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  cancel(){
    this.editMode = false;
    this.employeFormData();
  }
  editModeSubject(){
    this.showDisable.subscribe(arg => this.editMode = arg);
    
  }

  employeFormData(){
      this.employeesData
      .subscribe((data) => {
        this.employee = data;
        if (this.employee) {
       this._userList.matDrawer.open();
          this.employeesForm = this._formBuilder.group({
            employeeName: [this.employee.employeeName, [Validators.required]],
            role: [this.employee.empRole, [Validators.required]],
            emailId: [this.employee.email, [Validators.email]],
            password: ['',Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@#$%^&+=]).{8,}$')])],
            confirmPassword: ['', Validators.compose([Validators.required,Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@#$%^&+=]).{8,}$')])]
          },{
            validator: MustMatch('password', 'confirmPassword')
        });
        }
  else {
    this.back();
  }
      });
    
   
  }

  prevent(event){
    event.preventDefault();
   }
   
}
