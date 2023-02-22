import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil, filter } from 'rxjs';
import { ServiceService } from '../../../services/service.service';
import { UserServiceService } from '../user-service.service';
import { TasksheetService } from '../../admin/tasksheet/tasksheet.service';
import { UserService } from 'app/core/user/user.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { RoleFunction } from 'app/common/role-function';
import { TasklistComponent } from '../tasklist/tasklist.component';
// import{ SearchPipe } from 'app/core/user/user.search.pipe';

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})

export class UserListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  employeeList: any[] = [];
  presentEmployeeId: number;
  employeeData: any = this.userService.getEmployeeData();
  sprint: any = this.tasksheetService.getSprints();
  searchText: string;
  roleFunction: any = RoleFunction;
  showDisable:any=this.userService.getShowDisable();
  @ViewChild(MatTable) table: MatTable<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  employee : any[];
  
 displayedColumns : string[] = ['employeeName', 'emailId','NoofProjectsAssigned','details'];
  
 dataSource:MatTableDataSource<any>;

  count: any;
  constructor(private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private serviceRequest: ServiceService,
    private userService: UserServiceService,
    private tasksheetService: TasksheetService,
    private tasklist:TasklistComponent
  ) { 
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getAllEmployees();
    this.presentEmployeeId = JSON.parse(localStorage.getItem('employeeId'));
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {

        // Set the drawerMode if the given breakpoint is active
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
        }
        else {
          this.drawerMode = 'over';
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
    //this.getAllEmployees();
  }


  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  createContact(){

    // Go to the new contact
    this._router.navigate(['./userlist/adduser']);

    // Mark for check
    this._changeDetectorRef.markForCheck();

  }

  edit(data) {
    this.showDisable.next(false);
    this.employeeData.next(data);
    this.sprint.next([]);
    this._router.navigate(['./userlist/edituser']);
    this._changeDetectorRef.markForCheck();
  }


  getAllEmployees() {
    this.serviceRequest.getAllEmployees().subscribe((data) => {
    //  data = data.filter(x =>  x.employeeId!=this.presentEmployeeId );
      this.employeeList = data;
      this.dataSource = new MatTableDataSource(this.employeeList);
      setTimeout(() =>  this.dataSource.paginator = this.paginator,0);
     
      this.dataSource.sort = this.sort;

      const sortState: Sort = { active: 'employeeName', direction: 'asc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    })
  }

  sortData(sort: Sort) {
    if(this.paginator.length != 0){
      if (!sort.active || sort.direction === '') {
        this.dataSource = new MatTableDataSource(this.employeeList);
        return;
      }
  
      const sortedList = this.employeeList.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'employeeName':
            return compare(a.employeeName, b.employeeName, isAsc);
          case 'userName':
            return compare(a.username, b.username, isAsc);
          case 'emailId':
            return compare(a.email, b.email, isAsc);
          case 'NoofProjectsAssigned':
            return compare(a.projectAssignments.length, b.projectAssignments.length, isAsc);
          default:
            return 0;
        }
      });
  
      this.dataSource = new MatTableDataSource(sortedList);
      this.applyFilter();
    }
   
  }

  cleared(){
    this.inpVal=''
    this.applyFilter();
  }
  inpVal='';
  filterdData:any;
  applyFilter() {
    
    this.dataSource.filter = this.inpVal.trim().toLowerCase();
    this.dataSource.paginator = this.paginator
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }   
  }

  
}


