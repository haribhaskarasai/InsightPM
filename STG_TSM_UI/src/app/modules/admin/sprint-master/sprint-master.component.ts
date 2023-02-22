import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'app/services/service.service';
import { TaskSheet } from '../createtask/createtask.types';
import { CreatesprintComponent } from '../createsprint/createsprint.component';

@Component({
  selector: 'app-sprint-master',
  templateUrl: './sprint-master.component.html',
  styleUrls: ['./sprint-master.component.scss']
})
export class SprintMasterComponent implements OnInit {
  selectedTask: any;
  task : TaskSheet[];
  viewDetail: boolean = false;
  constructor(private service: ServiceService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTaskSheets();
  }

  getTaskSheets(){

    this.service.getTaskSheets().subscribe(data => {
       this.task = data;
    })
    
  }
  openDialog(){
    const dialogRef = this.dialog.open(CreatesprintComponent,{
      width:"50vw",   
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  toggleDetails(){
    this.viewDetail = !this.viewDetail;
  }
  mydate = new Date();
  tasks = [
    { id:'1',TaskName: 'Create the landing/marketing page and host it on the beta channel', 
    employeeName: 'Caros Denni',
    PlannedDate : '2022-08-24', ActualDate:'2022-08-25' , Status: 'In Progress'},
    { id:'2',TaskName: 'Create the landing/marketing page and host it on the beta channel', 
    employeeName: 'Alvarado Turner',
    PlannedDate : '2022-08-24', ActualDate:'2022-08-25' , Status: 'Not Started'},
    { id:'3',TaskName: 'Create the landing/marketing page and host it on the beta channel', 
    employeeName: 'Dejesus Michael',
    PlannedDate : '2022-08-24', ActualDate:'2022-08-25' , Status: 'In Progress'},
    { id:'4',TaskName: 'Create the landing/marketing page and host it on the beta channel', 
    employeeName: 'Dena Molina',
    PlannedDate : '2022-08-24', ActualDate:'2022-08-25' , Status: 'Completed'},
    { id:'5',TaskName: 'Create the landing/marketing page and host it on the beta channel', 
    employeeName: 'Caros Denni',
    PlannedDate : '2022-08-24', ActualDate:'2022-08-25' , Status: 'Completed'},
    { id:'6',TaskName: 'Create the landing/marketing page and host it on the beta channel', 
    employeeName: 'Caros Denni',
    PlannedDate : '2022-08-24', ActualDate:'2022-08-25' , Status: 'Completed'}
  ]
}
