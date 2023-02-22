import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { EmployeeListComponent } from './modules/admin/employee-list/employee-list.component';
import { CreateTaskComponent } from './modules/admin/createtask/createtask.component';
import { CreatesprintComponent } from './modules/admin/createsprint/createsprint.component';
import { TasksheetComponent } from './modules/admin/tasksheet/tasksheet.component';
import { SprintMasterComponent } from './modules/admin/sprint-master/sprint-master.component';
import { CreateuserstoryComponent } from './modules/admin/createuserstory/createuserstory.component';
import { TasklistComponent } from './modules/user/tasklist/tasklist.component';
import { Role } from './common/role';
import { ProjectAssignmentComponent } from './modules/user/project-assignment/project-assignment.component';
import { EditprofileComponent } from './modules/user/editprofile/editprofile.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: '/userlist' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: '/userlist' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
           
        ]
    },
    // {
    //     path:'timesheet',
    //     children: [
    //         {path:'create'}
    //     ]
    // },
    // {
    //     path:'user',
    //     canActivate: [AuthGuard],
    //     children: []
    // },
    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            expectedRoles: [Role.admin]
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'example', loadChildren: () => import('app/modules/admin/createtask/createtask.module').then(m => m.CreateTaskModule) },
            {path: 'userlist', loadChildren: () => import('app/modules/user/user.module').then(m => m.UserModule)},
            {
                path: 'employees',
                component: EmployeeListComponent
            },
            {
                path: 'effortbook',
                component: TasksheetComponent,
               
            },
            {
                path: 'createtask',
                component: CreateTaskComponent
            },
            {
                path: 'dialogcontent',
                component: CreatesprintComponent
            },
            {
                path:'tasksheet',
                component: TasksheetComponent,
                children: [
                    {
                        path: ':id',
                        component: CreateTaskComponent
                    }
                ]
            },
            {
                path:'sprint',
                component: SprintMasterComponent
            },
            {
                path:'userstory',
                component: CreateuserstoryComponent
            } ,
            {
                path:'tasklist',
                component: TasklistComponent

            },
            {
                path:'projectassignment',
                component: ProjectAssignmentComponent
            },
            {
                path:'editprofile',
                component: EditprofileComponent
            }     
        ]}  
];
