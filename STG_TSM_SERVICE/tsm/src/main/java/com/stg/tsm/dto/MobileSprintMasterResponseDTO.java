package com.stg.tsm.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MobileSprintMasterResponseDTO {

	private List<MobileSprintMasterDTO> sprintMasters;
	private String message;
	
}
