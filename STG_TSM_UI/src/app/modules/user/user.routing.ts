import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddUserComponent } from './adduser/adduser.component';
import { ProjectAssignmentComponent } from './project-assignment/project-assignment.component';
import { UserEditComponent } from './useredit/useredit.component';
import { UserListComponent } from './userlist/userlist.component';


export const userRoutes: Route[] = [
    
            {
                path     : '',
                component: UserListComponent,
                children : [
                    {
                        path: 'adduser',
                        component: AddUserComponent
                    },
                    {
                        path:'edituser',
                        component: UserEditComponent
                    },
                    {
                        path:'projectassignment',
                        component:ProjectAssignmentComponent
                    }
                   
                ]
            },
            
        ];
