package com.stg.tsm.service;

import com.stg.tsm.entity.SprintMaster;
import com.stg.tsm.exception.TsmException;


public interface SprintService {

     SprintMaster createSprint(int projectId,int applicationId,SprintMaster sprintMaster) throws TsmException;
     
     SprintMaster getSprintById(int sprintId) throws TsmException;
     
}
