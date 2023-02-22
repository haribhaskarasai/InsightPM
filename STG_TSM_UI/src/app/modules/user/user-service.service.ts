import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from 'app/common/api-constants/api-constants';
import { environment } from 'environments/environment.local';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private _httpClient: HttpClient) { }

  private employeeData: BehaviorSubject<any> = new BehaviorSubject(null);

  private projectDataOfEmployee :BehaviorSubject<any> = new BehaviorSubject(null);

  private ShowBoolean :BehaviorSubject<any> = new BehaviorSubject(false);

  getEmployeeData(): Observable<any[]> {
    return this.employeeData;
  }

  getProjectDataOfEmployee(): Observable<any[]> {
    return this.projectDataOfEmployee;
  }
  getShowDisable(): Observable<Boolean> {
    return this.ShowBoolean;
  }
}
