import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'app/common/api-constants/api-constants';
import { TaskDetails, TaskList, TaskPagination, TaskSheet } from 'app/modules/admin/createtask/createtask.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { ProjectAssignment } from '../modules/user/ProjectAssignmnet';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private _tasksheet: BehaviorSubject<TaskSheet | null> = new BehaviorSubject(null);
  private _taskdetails: BehaviorSubject<TaskDetails | null> = new BehaviorSubject(null);
  private _pagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<TaskList[] | null> = new BehaviorSubject(null);

  private getEmployees = API.GET_EMPLOYEES;
  private addEmployee = API.CREATE_EMPLOYEE;
  private updateEmployee = API.UPDATE_EMPLOYEE;
  private addUserRoleConst = API.CREATE_USER_ROLE;




  baseUrl = environment.GLOBAL_URL;

  constructor(private _httpClient: HttpClient, private router: Router) { }


  /**
   * Get timesheet
   */
  getTaskSheets(): Observable<TaskSheet[]> {
    return this._httpClient.get<TaskSheet[]>("");
  }

  /**
   * Get taskdetails
   */
  getTaskDetails(): Observable<TaskDetails[]> {
    return this._httpClient.get<TaskDetails[]>("");
  }


  /**
   * get Assignmnet by project and employee
   * 
   */

  getAssignmentId(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "/assignmnet/read-all/project-employee-id", data);
  }

  /** 
  Create Sprint 
   */
  createSprint(projectId: number, applicationId: number, data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + `/sprint/create-sprint/${projectId}/${applicationId}`, data);
  }


  /**
 * Get projects
 */
  getAllProject(data: any): Observable<any> {
    return this._httpClient.post<any>((this.baseUrl + "/project/all"), data);
  }


  /**
   *  create user story 
   */
  createUserStory(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + `/userstory/create-userstory-master`, data);
  }

  /**
   * Get sprints
   */
  getSprintsById(id: number): Observable<any[]> {
    return this._httpClient.get<any[]>(this.baseUrl + `/application/get/sprints/application-id/${id}`)
  }



  /**
 * Get projects
 */
  getAllTask(data: any): Observable<any> {
    return this._httpClient.post<any>((this.baseUrl + "/task/all"), data)
  }

  searchUserstoryBysprindId(sprintId: any, offset: any, limit: any): Observable<any[]> {

    return this._httpClient.get<any[]>((this.baseUrl + `/task/search-user-story/sprintId/${sprintId}/${offset}/${limit}`))
  }

  //  searchUserstoryBysprindId2(sprintId:any,offset: any, limit: any): Observable<any>
  //  {
  //   let a ={
  //     sprintId:sprintId,
  //     offset:offset,
  //     limit:limit
  //   }
  //   return this._httpClient.post<any[]>((this.baseUrl +`/task/search/tasklist`),a)
  //  }

  createActivity(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "/task/create", data);
  }


  updateActivity(data: any): Observable<any> {
    return this._httpClient.put<any>(this.baseUrl + "/task/update", data);
  }

  getSprint(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "/sprint/search-sprint", data)
  }

  //  seraching task 

  searchTasks(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "/search/task/sprint-id", data);
  }

  //delete Task 

  deleteTask(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "/task/delete", data);
  }

  /**
   * Calendar worked per day
   */

  getWorkingPerDayPresentMonth(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "/calendar/day-work", data);
  }

  getWorkingPerDay(data: any): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "/calendar/day-work/sprint-id", data);
  }

  getAllProjects(): Observable<any> {
    return this._httpClient.get<any>(this.baseUrl + "/project/allprojects");
  }

  /**
  * Get all employees data
  */
  getAllEmployees(): any {
    return this._httpClient.get(this.baseUrl + this.getEmployees);
  }

  /**
   * create an employee
   * @param user 
   * @returns 
   */
  createEmployee(user: any): Observable<any> {
    return this._httpClient.post(this.baseUrl + this.addEmployee, user);
  }

  createProjectAsignmnet(data: ProjectAssignment[]): Observable<any> {
    return this._httpClient.post(this.baseUrl + "/assignmnet/project-application/create", data);
  }

  editEmployee(data: any): Observable<any> {
    return this._httpClient.post(this.baseUrl + "/employee/resetPassword", data);
  }

  getAllActivity(): Observable<any> {
    return this._httpClient.get(this.baseUrl + "/parameter/activity/all");
  }

  createUserRoleAssignment(userRoleObj: any): Observable<any> {
    return this._httpClient.post(this.baseUrl + this.addUserRoleConst, userRoleObj);
  }

  getActivitiesByProject(data:any):Observable<any>{
    return this._httpClient.post(this.baseUrl + "/project-association/project-id",data);
  }


}
