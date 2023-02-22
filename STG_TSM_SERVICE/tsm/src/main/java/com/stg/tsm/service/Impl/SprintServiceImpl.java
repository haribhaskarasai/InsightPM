package com.stg.tsm.service.Impl;

import com.stg.tsm.entity.ProjectApplicationDetail;
import com.stg.tsm.entity.ProjectMaster;
import com.stg.tsm.entity.SprintMaster;
import com.stg.tsm.exception.TsmException;
import com.stg.tsm.repos.ProjectApplicationDetailRepository;
import com.stg.tsm.repos.ProjectMasterRepository;
import com.stg.tsm.repos.SprintMasterRepository;
import com.stg.tsm.service.SprintService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 * @author saikrishnan
 *
 *
 */

@Service
public class SprintServiceImpl implements SprintService {

    @Autowired(required = true)
    private SprintMasterRepository sprintMasterRepository;

    @Autowired
    private ProjectMasterRepository projectMasterRepository;

    @Autowired
    private ProjectApplicationDetailRepository projectApplicationDetailRepository;
    @Override
    public SprintMaster createSprint(int projectId, int applicationId, SprintMaster sprintMaster) throws TsmException {
    	
      ProjectMaster projectMaster = projectMasterRepository.findById(projectId).
        		orElseThrow(() -> new TsmException("Project Master is not Found"));
      
      ProjectApplicationDetail projectApplicationDetail = projectApplicationDetailRepository.findById(applicationId).
    		  orElseThrow(() -> new TsmException("Project Application  is not Found"));
      
      
      if(projectMaster != null && projectApplicationDetail != null) {
    	  sprintMaster.setProjectMaster(projectMaster);
    	  sprintMaster.setProjectApplicationDetail(projectApplicationDetail);
    	  try {
    		 return sprintMasterRepository.save(sprintMaster);
		} catch (Exception e) {
			 throw new TsmException("Sprint is not Created");
		}
      }else {
    	  throw new TsmException("Given Correct Details");
      }
    }
	@Override
	public SprintMaster getSprintById(int sprintId) throws TsmException {

		return sprintMasterRepository.findById(sprintId).orElseThrow(
				() -> new TsmException("sprint not found"));
	}
}
