import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ServiceService } from 'app/services/service.service';
import { Subject, takeUntil } from 'rxjs';
import { SprintList, TaskSheet } from '../createtask/createtask.types';
import { CreatesprintComponent } from '../createsprint/createsprint.component';


@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
 

  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
  viewDetail: boolean = false;
  drawerMode: 'side' | 'over';
  selectedTask: any;
  task : TaskSheet[];
  sprintList: SprintList[];
  tab:any;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _router: Router,
    private service: ServiceService,
    public dialog: MatDialog,
    
    ) { }

    
  ngOnInit(): void {
    this.tab= this._router.url;
    this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((state) => {

        // Calculate the drawer mode
        this.drawerMode = state.matches ? 'side' : 'over';

        // Mark for check
        this._changeDetectorRef.markForCheck();
    });
  }

  toggleDetails(){
    this.viewDetail = !this.viewDetail;
  }

  taskDetail(){
    this._router.navigateByUrl('timesheet/1');
  }

  taskDetails(){
    this._router.navigateByUrl('timesheet/');
  }

  onBackdropClicked(): void
  {
      // Go back to the list
      this._router.navigate(['./'], {relativeTo: this._activatedRoute});

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }


  getTaskSheets(){

    this.service.getTaskSheets().subscribe(data => {
       this.task = data;
    })
    
  }

  
  openDialog(){
    const dialogRef = this.dialog.open(CreatesprintComponent,{
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
mydate = new Date();

  tasks = [
    { TaskName: 'Create the landing/marketing page and host it on the beta channel', PlannedDate : '2022-08-24', ActualDate:'2022-08-25' , EffortSpent: '5', Status: 'Completed'}
  ]

sprints = [
{SprintName: 'Sprint 1', StartDate: '2022-01-24', EndDate: '2022-01-31', EstimatedHours: '5'}
]

}
