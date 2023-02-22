package com.stg.tsm.mobileController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stg.tsm.dto.CreateUserStoryResponseDTO;
import com.stg.tsm.dto.MobileUserStoryResopnseDto;
import com.stg.tsm.dto.UserstoryCreateDTO;
import com.stg.tsm.entity.UserstoryMaster;
import com.stg.tsm.exception.MobileTsmException;
import com.stg.tsm.service.MobileAppService;

@RestController
@RequestMapping("/mobile/employee/userstory")
public class UserstoryMasterMobileController {

	@Autowired
	private MobileAppService mobileAppService;

	@PostMapping("/create-userstory-master")
	public ResponseEntity<CreateUserStoryResponseDTO> createUserstoryMaster(
			@RequestBody UserstoryCreateDTO userstoryCreateDTO) throws MobileTsmException {
		CreateUserStoryResponseDTO response = mobileAppService.createUserstoryMaster(userstoryCreateDTO.getSprintId(), userstoryCreateDTO);
		return new ResponseEntity<CreateUserStoryResponseDTO>(response, HttpStatus.OK);
	}

	@PostMapping("/get-userstorylist")
	public ResponseEntity<MobileUserStoryResopnseDto> getUserstoryMasterList(@RequestBody UserstoryCreateDTO userstoryCreateDTO) throws MobileTsmException {
		return ResponseEntity.status(HttpStatus.OK).body(mobileAppService.getUserstoryMasterList(userstoryCreateDTO.getSprintId()));
	}
	
	@PutMapping("/update-userstory")
    public ResponseEntity<String> updateUserstoryMaster(@RequestBody UserstoryMaster UserstoryMaster){
      return ResponseEntity.status(HttpStatus.OK).body(mobileAppService.updateUserstoryMaster(UserstoryMaster));
    }
}
