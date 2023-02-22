package com.stg.tsm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateSprintMasterResponseDTO {

	private MobileSprintMasterDTO sprint;
	private String message;
	
}
