import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from "rxjs";
import { TasksheetComponent } from "./tasksheet.component";
import { environment } from "environments/environment.local";
import { Sprint } from "../createtask/createtask.types";
import { ServiceService } from "../../../services/service.service";

@Injectable({
  providedIn: "root",
})
export class TasksheetService {
  baseUrl = environment.GLOBAL_URL;

  private sprints: BehaviorSubject<any> = new BehaviorSubject([]);
  private sprintId: BehaviorSubject<any> = new BehaviorSubject(null);
  private userstory: BehaviorSubject<any> = new BehaviorSubject([]);
  private calendarMonthMap: BehaviorSubject<any> = new BehaviorSubject(
    new Map<any, any>()
  );
  private totalWorkingHours:BehaviorSubject<any>=new BehaviorSubject(0);
  private targetWorkingHours:BehaviorSubject<any>=new BehaviorSubject(0);
  private sprint:BehaviorSubject<any>=new BehaviorSubject([]);
  private startDate :BehaviorSubject<any>=new BehaviorSubject(null);
  private endDate :BehaviorSubject<any>=new BehaviorSubject(null);
  
  private assignmnetId:BehaviorSubject<any>=new BehaviorSubject(0);
  private projectIdsubject:BehaviorSubject<any>=new BehaviorSubject(0);

  public workingHours:BehaviorSubject<any>=new BehaviorSubject(0);
  public targetHours:BehaviorSubject<any>=new BehaviorSubject(0);

  constructor() {}

  getSprints(): Observable<any[]> {
    return this.sprints;
  }
  getUserstory(): Observable<any[]> {
    return this.userstory;
  }

  getSprintId(): Observable<any> {
    return this.sprintId;
  }

  getCalendarMonthMap(): Observable<any[]> {
    return this.calendarMonthMap;
  }

  getTotalWorkingHours(): Observable<any> {
    return this.totalWorkingHours;
  }
  getTargetWorkingHours(): Observable<any> {
    return this.targetWorkingHours;
  }

  getSprint(): Observable<any> {
    return this.sprint;
  }
  getStartDate(): Observable<any> {
    return this.startDate;
  }
  getEndDate(): Observable<any> {
    return this.endDate;
  }

  getAssignmnetId(): Observable<any> {
    return this.assignmnetId;
  }
  getProjectId(): Observable<any> {
    return this.projectIdsubject;
  }

  getworkingHours():Observable<any>{
    return this.workingHours;
  }

}
