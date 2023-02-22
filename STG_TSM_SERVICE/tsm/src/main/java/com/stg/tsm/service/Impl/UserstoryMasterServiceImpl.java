package com.stg.tsm.service.Impl;

import com.stg.tsm.dto.UserstoryCreateDTO;

import com.stg.tsm.entity.SprintMaster;
import com.stg.tsm.entity.UserstoryMaster;

import com.stg.tsm.exception.TsmException;
import com.stg.tsm.repos.SprintMasterRepository;
import com.stg.tsm.repos.UserstoryMasterRepository;
import com.stg.tsm.service.UserstoryMasterService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 * @author saikrishnan
 * @author jenifer
 *
 */
/*
 */

@Service
public class UserstoryMasterServiceImpl implements UserstoryMasterService {
	@Autowired
	private UserstoryMasterRepository userstoryMasterRepository;

	@Autowired
	private SprintMasterRepository sprintMasterRepository;
	
	


	@Override
	public UserstoryMaster createUserstoryMaster(int sprintId, UserstoryCreateDTO userstoryMasterDTO)
			throws TsmException {

		SprintMaster sprintMaster = sprintMasterRepository.findById(sprintId)
				.orElseThrow(() -> new TsmException("Sprint not Found with given id : " + sprintId));
		List<UserstoryMaster> userstoryListTemp = sprintMaster.getUserstoryMasters();

		UserstoryMaster userstoryMaster = new UserstoryMaster();

		for (UserstoryMaster userstoryMasterTemp : userstoryListTemp) {
			if (userstoryMasterTemp.getUserstoryName().equals(userstoryMasterDTO.getUserstoryName())) {
				throw new TsmException("Userstory is already exist");
			}
		}
		userstoryMaster.setSprintMaster(sprintMaster);
		userstoryMaster.setCreatedBy(userstoryMasterDTO.getCreatedBy());
		userstoryMaster.setCreatedDate(userstoryMasterDTO.getCreatedDate());
		userstoryMaster.setEstimatedStorypoints(userstoryMasterDTO.getEstimatedStorypoints());
		userstoryMaster.setUserstoryDescription(userstoryMasterDTO.getUserstoryDescription());
		userstoryMaster.setPlannedEfforts(userstoryMasterDTO.getPlannedEfforts());
		userstoryMaster.setUserstoryName(userstoryMasterDTO.getUserstoryName());
		try {
			UserstoryMaster userStory = userstoryMasterRepository.save(userstoryMaster);

			return userstoryMasterRepository.save(userStory);

		} catch (Exception e) {
			throw new TsmException("Userstory is not Created");
		}

	}

	@Override
	public List<UserstoryCreateDTO> getUserstoryMasterList(int sprintId) throws TsmException {

		SprintMaster sprintMasterTemp = sprintMasterRepository.findById(sprintId)
				.orElseThrow(() -> new TsmException("Sprint not Found with given id : " + sprintId));
		List<UserstoryMaster> userstoryListTemp = sprintMasterTemp.getUserstoryMasters();
		List<UserstoryCreateDTO> listOfUserStories = new ArrayList<UserstoryCreateDTO>();

		if (userstoryListTemp.isEmpty()) {
			throw new TsmException("No userstoryList Found");

		} else {
			for (UserstoryMaster userstoryMaster : userstoryListTemp) {
				UserstoryCreateDTO createDTO = new UserstoryCreateDTO();

				createDTO.setUserstoryId(userstoryMaster.getUserstoryId());
				createDTO.setCreatedBy(userstoryMaster.getCreatedBy());
				createDTO.setCreatedDate(userstoryMaster.getCreatedDate());
				createDTO.setEstimatedStorypoints(userstoryMaster.getEstimatedStorypoints());
				createDTO.setPlannedEfforts(userstoryMaster.getPlannedEfforts());
				createDTO.setUpdatedBy(userstoryMaster.getUpdatedBy());
				createDTO.setUpdatedDate(userstoryMaster.getUpdatedDate());
				createDTO.setUserstoryDescription(userstoryMaster.getUserstoryDescription());
				createDTO.setUserstoryName(userstoryMaster.getUserstoryName());

				listOfUserStories.add(createDTO);

			}
		}
		return listOfUserStories;

	}

	@Override
	public List<UserstoryMaster> deleteUserstoryMaster(int userstoryId) throws TsmException {
		Optional<UserstoryMaster> userstoryMasterTemp = userstoryMasterRepository.findById(userstoryId);
		if (userstoryMasterTemp.isEmpty()) {
			throw new TsmException("No Userstory found");

		} else {
			userstoryMasterRepository.deleteById(userstoryId);
		}
		return userstoryMasterRepository.findAll();
	}

	@Override
	public UserstoryMaster updateUserstoryMaster(UserstoryCreateDTO userstoryCreateDTO) throws TsmException {
		System.out.println(userstoryCreateDTO.getSprintId());
		
		SprintMaster sprintMaster = sprintMasterRepository.findById(userstoryCreateDTO.getSprintId()).orElseThrow(
				() -> new TsmException("Sprint not Found with given id : " + userstoryCreateDTO.getSprintId()));
		
		List<UserstoryMaster> userstoryListTemp = sprintMaster.getUserstoryMasters();
		UserstoryMaster userstoryMaster = new UserstoryMaster();
		for (UserstoryMaster userstoryMasterTemp : userstoryListTemp) {
			
			
			if (userstoryMasterTemp.getUserstoryId()==userstoryCreateDTO.getUserstoryId()) {
				userstoryMaster.setUserstoryId(userstoryMasterTemp.getUserstoryId());
				userstoryMaster.setSprintMaster(sprintMaster);
				userstoryMaster.getSprintMaster().setSprintId(userstoryCreateDTO.getSprintId());
				userstoryMaster.setUpdatedBy(userstoryCreateDTO.getUpdatedBy());
				userstoryMaster.setUpdatedDate(userstoryCreateDTO.getUpdatedDate());
				userstoryMaster.setEstimatedStorypoints(userstoryCreateDTO.getEstimatedStorypoints());
				userstoryMaster.setUserstoryDescription(userstoryCreateDTO.getUserstoryDescription());
				userstoryMaster.setPlannedEfforts(userstoryCreateDTO.getPlannedEfforts());
				userstoryMaster.setUserstoryName(userstoryCreateDTO.getUserstoryName());
			
			}
		}
		
		userstoryMasterRepository.save(userstoryMaster);

		return userstoryMaster;
		
	}

}
