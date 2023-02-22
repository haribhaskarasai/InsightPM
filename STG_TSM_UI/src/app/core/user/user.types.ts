import { List } from "lodash";

export interface User
{
    id: number;
    avatar?: string;
    status?: string;
    username: string;
    employeeName: string;
    email: string;
    joiningDate: Date;
    relievingDate: Date;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    projectAssignments: any;
    empRole: string;
    empFunctions: any;
}
