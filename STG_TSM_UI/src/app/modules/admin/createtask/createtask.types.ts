export interface TaskSheet
{
    taskName: string;
    plannedDate: string;
    actualDate: string;
    effortSpent: string;
    userStory: string;
    
}

export interface SprintList
{
    sprintName: string;
    startDate: string;
    endDate: string;
    estimatedHours: string;
    status: string;
    
}

export interface TaskDetails
{
    taskId: string;
    taskName: string;
    status: string;
    date: {
        date: string;
        hours: string;
    }[];
    remark: string;
}

export interface Sprints
{
    sprintName: string;
    sprintDescription: string;
    startDate: string;
    endDate: string;
}

export interface UserStory
{
    userstoryId : string;
    userstoryName : string;
    plannedEfforts : number;
    estimatedStoryPoints: number;

}

export interface Tag
{
    id?: string;
    title?: string;
}

export interface Sprint{
    id: number;
    sprintName: string;
}
export interface Projects{
projectId: number;
  projectName: string;
 // applicationName: string;
}

export interface TaskPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface TaskList{
   
    userstoryName: string;
    date: number;
    activity: string;
    efforts: number;
}
