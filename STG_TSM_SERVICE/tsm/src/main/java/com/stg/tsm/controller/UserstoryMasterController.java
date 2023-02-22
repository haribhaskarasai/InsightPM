package com.stg.tsm.controller;

import com.stg.tsm.dto.UserstoryCreateDTO;

import com.stg.tsm.entity.UserstoryMaster;

import com.stg.tsm.service.UserstoryMasterService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 
 * @author saikrishnan
 * @author jenifer
 *
 */

@RestController
@RequestMapping("/userstory")
public class UserstoryMasterController {

	@Autowired
	private UserstoryMasterService userstoryMasterService;

	@PostMapping("/create-userstory-master")
	public ResponseEntity<UserstoryMaster> createUserstoryMaster(@RequestBody UserstoryCreateDTO userstoryCreateDTO) {

		return ResponseEntity.status(HttpStatus.OK).body(
				userstoryMasterService.createUserstoryMaster(userstoryCreateDTO.getSprintId(), userstoryCreateDTO));
	}

	@PostMapping("/get-userstorylist")
	public ResponseEntity<List<UserstoryCreateDTO>> getUserstoryMasterList(
			@RequestBody UserstoryCreateDTO userstoryCreateDTO) {

		return ResponseEntity.status(HttpStatus.OK)
				.body(userstoryMasterService.getUserstoryMasterList(userstoryCreateDTO.getSprintId()));
	}

	@PutMapping("/update-userstory")
	public ResponseEntity<UserstoryMaster> updateUserstoryMaster(@RequestBody UserstoryCreateDTO userstoryCreateDTO) {
		return ResponseEntity.status(HttpStatus.OK)
				.body(userstoryMasterService.updateUserstoryMaster(userstoryCreateDTO));
	}

	@PutMapping("delete")
	public ResponseEntity<List<UserstoryMaster>> deleteUserstoryById(
			@RequestBody UserstoryCreateDTO userstoryCreateDTO) {
		return ResponseEntity.status(HttpStatus.OK)
				.body(userstoryMasterService.deleteUserstoryMaster(userstoryCreateDTO.getUserstoryId()));
	}

}
