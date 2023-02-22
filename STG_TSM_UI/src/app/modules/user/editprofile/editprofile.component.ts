import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { UserServiceService } from '../user-service.service';
import { ServiceService } from '../../../services/service.service';
import { TsmAlertServiceService } from '../../../services/tsm-alert-service.service';
import { Router } from '@angular/router';
import { MustMatch } from 'app/services/password-validator.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  employeesData: any = this.userService.getEmployeeData();
  profileForm: UntypedFormGroup;
  passwordMeter: boolean = true;
  user: any;
  employee: any;

  constructor(private fb: FormBuilder,
    private userService: UserServiceService,
    private _userService: UserService,
    private service: ServiceService,
    private tmsAlert: TsmAlertServiceService,
    private _router: Router,) {
    // Subscribe to the user service

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
  ngOnInit() {
    this._userService.user$
      .pipe((takeUntil(this._unsubscribeAll)))
      .subscribe((user: User) => {
        this.user = user;
        console.log(this.user)
      });
    this.profileForm = this.fb.group({
      employeeName: [this.user.employeeName, [Validators.required]],
      role:[this.user.empRole, [Validators.required]],
      emailId: [this.user.email, [Validators.email]],
      currentPassword: ['', [Validators.required]],
      newpassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@#$%^&+=]).{8,}$')])],
      confirmPassword: ['', Validators.compose([ ,Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@#$%^&+=]).{8,}$')])]
    },{
      validator: MustMatch('newpassword', 'confirmPassword')
  })
  }

  get password() {
    return this.profileForm.get('password');
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

  onCancel() {
    this._router.navigate([''])
  }

  save() {
    let updateEmployees = {
      adminId: this.user.employeeId,
      adminName: this.user.employeeName,
      adminEmail: this.user.email,
      employeeId: this.user.employeeId,
      employeeName: this.user.employeeName,
      employeeEmail: this.user.email,
      oldPassword: this.profileForm.value.currentPassword,
      newPassword: this.profileForm.value.newpassword,
    }
    this.service.editEmployee(updateEmployees).subscribe((data) => {
      this.tmsAlert.showSuccess("Password updated sucessfully");
      this._router.navigate(['./']);
    },
      (error) => {
        if (error.status === 404 || error.status === 500) {
          this.tmsAlert.showError("Current Password is incorrect!");
        }
      })
  }

  prevent(event){
    event.preventDefault();
   } 
}
