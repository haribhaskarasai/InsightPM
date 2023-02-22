/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'backLog',
        title: 'Backlog',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'backLog.timesheet',
                title: 'Timesheet',
                type: 'basic',
                icon: 'heroicons_outline:clock',
                link: '/effortbook'
            }]
    },
    {
        id: 'master',
        title: 'Master',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'master.customer',
                title: 'Customer',
                type: 'basic',
                icon: 'feather:users',
            },
            {
                id: 'master.project',
                title: 'Project',
                type: 'basic',
                icon: 'feather:file-text',
            }]
    },
    {
        id: 'user',
        title: 'User',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/userlist',
        children: [
            {
                id: 'user.adduser',
                title: 'AddUser',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/user/adduser'
            }]
    }
   
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'user',
        title: 'User',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/userlist',
        children: [
            {
                id: 'user.adduser',
                title: 'AddUser',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/user/adduser'
            },
            {
                id: 'user.edituser',
                title: 'EditUser',
                type: 'basic',
                icon: 'heroicons_outline:edit',
                link: '/user/edituser'
            }
        ]      
    },
    {
        id: 'timesheet',
        title: 'Effort Book',
        type: 'basic',
        icon: 'heroicons_outline:clock',
        link: '/effortbook',
        children: [
            {
                id: 'backLog.timesheet',
                title: 'Timesheet',
                type: 'basic',
                icon: 'heroicons_outline:clock',
                link: '/effortbook'
            }]
    }
    // {
    //     id: 'master',
    //     title: 'Master',

    //     type: 'aside',
    //     icon: 'heroicons_outline:home',
    //     children: [
    //         {
    //             id: 'master.customer',
    //             title: 'Customer',
    //             type: 'basic',
    //             icon: 'feather:users',
    //         },
    //         {
    //             id: 'master.project',
    //             title: 'Project',
    //             type: 'basic',
    //             icon: 'feather:file-text',
    //         }]
    // },
    
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];

   
