import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { tags } from 'app/mock-api/apps/contacts/data';
import { filter, Subject, takeUntil } from 'rxjs';
import { EmployeeDetailComponent } from '../employee-detail/employee-detail.component';
import { TasksheetComponent } from '../tasksheet/tasksheet.component';
import { Status } from './status';

@Component({
    selector: 'app-create-task',
    templateUrl: './createtask.component.html',
    styleUrls:['./createtask.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateTaskComponent implements OnInit, OnDestroy {
    btnClick = 0;
    listOfFields: Array<any> = [];
    status: Status[] = [
        {value: '', viewValue: 'Not Started'},
        {value: '', viewValue: 'InProgress'},
        {value:'', viewValue:'Complete'}
      ];
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('titleField') private _titleField: ElementRef;
    taskForm: UntypedFormGroup;
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    


    /**
     * Constructor
     */
    constructor(private _tasksListComponent: TasksheetComponent,
        private _router: Router,
        private _formBuilder: UntypedFormBuilder, private _changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        // Open the drawer
        this._tasksListComponent.matDrawer.open();
        this.taskForm = this._formBuilder.group({
            title: [''],
            dateArray: this._formBuilder.array([
                this.createDate,
            ])
        });
        // this.date.push(this.createDate);
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Listen for matDrawer opened change
        this._tasksListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {

                // Focus on the title element
                this._titleField.nativeElement.focus();
            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    taskView() {
       this._tasksListComponent.matDrawer.close();
        this._router.navigateByUrl('tasksheet');
    }

    createDate() {
        return this._formBuilder.group({
            dateVal: [''],
            hours: ['']
        })
    }

    get date() {
        return this.taskForm.get('dateArray') as FormArray
    }
    addDateField() {
        this.btnClick = this.btnClick + 1;
        this.date.push(this.createDate());
        this.listOfFields.push(this.btnClick);
        console.log(this.listOfFields);

    }

    removeDateField(index: number): void
    {
        // Get form array for date
        const dateFormArray = this.taskForm.get('dateArray') as UntypedFormArray;

        // Remove the date field
        dateFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    // deleteClicked(id:number){
    //     this.listOfFields=this.listOfFields.filter(function(value, index, arr){ 
    //       return value !== id;
    //   });
    //     }

}
