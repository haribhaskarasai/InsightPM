export interface User {
    employeeName: string;
    emailId: string;
    password: string;
    confirmPassword: string;
    project?: {
        project: string;
        
    }[];

}