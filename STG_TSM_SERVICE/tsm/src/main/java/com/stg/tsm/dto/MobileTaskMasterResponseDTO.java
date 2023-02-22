package com.stg.tsm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MobileTaskMasterResponseDTO {

	private TargetedHoursWithUserStoriesDto dashboard;
	private String message;
	
}
