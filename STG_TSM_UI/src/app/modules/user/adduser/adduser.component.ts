import { formatDate, TitleCasePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MustMatch } from 'app/services/password-validator.service';
import { ServiceService } from 'app/services/service.service';
import { TsmAlertServiceService } from 'app/services/tsm-alert-service.service';
import { Subject, takeUntil } from 'rxjs';
import { UserServiceService } from '../user-service.service';
import { UserListComponent } from '../userlist/userlist.component';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
  providers: [TitleCasePipe]
})
export class AddUserComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  employeesForm: UntypedFormGroup;
  newEmployee: any;
  projects: any[];
  user: User;
  employeeList: any;
  passwordMeter:boolean = true;
  
  private _changeDetectorRef: any;
  



  constructor(private _formBuilder: UntypedFormBuilder,
    private _userList: UserListComponent,
    private router: Router ,
    private _userService: UserService,
    private userService: UserServiceService,
    private service: ServiceService,
    private tsmAlertService:TsmAlertServiceService,
    private userListComp:UserListComponent,
    public titleCasePipe: TitleCasePipe) {
      // Subscribe to the user service
      this._userService.user$
      .pipe((takeUntil(this._unsubscribeAll)))
      .subscribe((user: User) => {
          this.user = user;
      });
  }

  ngOnInit(): void {
   //this.getAllProjects();
    this.getAllEmployees();
    this._userList.matDrawer.open();
    this.employeesForm = this._formBuilder.group({
      employeeName          : ['',[Validators.required]],
      emailId     : ['',[Validators.email]],
      password        : ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-.,]).{8,}$')]],
      confirmPassword:['',[Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-.,]).{8,}$')]],
  },{
    validator: MustMatch('password', 'confirmPassword')
});
  
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
   get password(){
    return this.employeesForm.get('password');
   }

   changePasswordMeter(){
    this.passwordMeter=!this.passwordMeter
   }

   blurPass :boolean = false
   blurPass1 :boolean = false
   blurMethod(){
    this.blurPass=false
   }
   focusMethod(){
    this.blurPass=true
   }

   blurMethod1(){
    this.blurPass1=false
   }
   focusMethod1(){
    this.blurPass1=true
   }

 
 


  save(){

    if(this.employeesForm.invalid){
      return ;
    }

    const todayDate = new Date();
    this.newEmployee = {
      employeeName: this.titleCasePipe.transform(this.employeesForm.value.employeeName) ,
      email: this.employeesForm.value.emailId,
      password: this.employeesForm.value.password,
      username: this.employeesForm.value.emailId.split('@')[0],
      joiningDate: formatDate(todayDate, 'yyyy-MM-dd', 'en'),
      relievingDate: '',
      createdBy: this.user.username,
      createdDate: formatDate(todayDate, 'yyyy-MM-dd', 'en'),
      updatedBy: this.user.username,
      updatedDate: formatDate(todayDate, 'yyyy-MM-dd', 'en'),
      creatorEmail:this.user.email
    }

    const newUser = this.employeeList.find((employee: { email: any; }) => employee.email === this.employeesForm.value.emailId)
    if(newUser == undefined){
      this.service.createEmployee(this.newEmployee).subscribe(data => {
        console.log(data);

        if(data !== null){
          const userRoleObj = {
            userRoleId: 0,
            createdBy: this.user.username,
            createdDate: formatDate(todayDate, 'yyyy-MM-dd', 'en'),
            updatedBy: this.user.username,
            updatedDate: formatDate(todayDate, 'yyyy-MM-dd', 'en'),
            employeeDetail: {
              employeeId: data.employeeId
            },
            roleMaster: {
              roleId: 2
            }
          }

          this.service.createUserRoleAssignment(userRoleObj).subscribe(r => {
            console.log("role assinged to employee")
          })
        }

        this.tsmAlertService.showSuccess("New Employee is created !!!" )
       this.back();
        this.userListComp.getAllEmployees();
        },
        (error: any) => console.log(error)
      )

    }else{
      this.tsmAlertService.showError("Employee already exists !!!" )
    }

  }
 
  getAllProjects() {
    this.service.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects)
    });
  }

  getAllEmployees(){
    this.service.getAllEmployees().subscribe((data) => {
      this.employeeList = data;
    })
  }

  back(){
    this._userList.matDrawer.close();
    this.router.navigate(['./userlist']);
  }

// addProjects() {
//   const add = this.employeesForm.get('project') as FormArray;
//   add.push(this._formBuilder.group({
//     project: []
//   }))
// }
//   cancel(){
//     this.employeesForm = this._formBuilder.group({
//       employeeName          : ['',[Validators.required]],
//       emailId     : ['',[Validators.email]],
//       password        : ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-.,]).{8,}$')]],
//       confirmPassword:['',[Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-.,]).{8,}$')]],
//   },{
//     validator: MustMatch('password', 'confirmPassword')
// });
//   }

//   submitForm(formDirective: FormGroupDirective): void {
//     formDirective.resetForm();
//     this.employeesForm = this._formBuilder.group({
//       employeeName          : ['',[Validators.required]],
//       emailId     : ['',[Validators.email]],
//       password        : ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-.,]).{8,}$')]],
//       confirmPassword:['',[Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-.,]).{8,}$')]],
//   },{
//     validator: MustMatch('password', 'confirmPassword')
// });

// }

   prevent(event){
    event.preventDefault();
   } 
}
