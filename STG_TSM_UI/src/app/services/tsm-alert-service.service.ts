import { Injectable } from '@angular/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertService } from '@fuse/components/alert';
@Injectable({
  providedIn: 'root'
})
export class TsmAlertServiceService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  snackbar: any;

  constructor
  ( private toaster: MatSnackBar,
    private fuseAlertService:FuseAlertService) 
    { 
      this.snackbar=toaster
    }

  showSuccess(message){
    this.showMatToaster('Sucess',message,'bg-green-600','success',2000)
  }

  showError(message){
    this.showMatToaster('Error',message,'bg-red-600','error',2000)
  }

  showInfo(message){
    this.showMatToaster('Information',message,'bg-red-600','info',5000)
  }

  showWarning(message){
    this.showMatToaster('Warning',message,'bg-red-600','warning',5000)
  }

  showMatToaster(alertTitle,message:string,type:string,type2:string,duration?:number){
    this.snackbar.open(message,
    "X", {
    panelClass: ['mat-toolbar', type],
    duration: duration,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition
  });
 //this.fuseAlertService.showAlert('mainAlertBox',type2,alertTitle,message);
}
}
