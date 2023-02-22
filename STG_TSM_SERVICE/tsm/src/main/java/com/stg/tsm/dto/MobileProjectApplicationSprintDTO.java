package com.stg.tsm.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MobileProjectApplicationSprintDTO {
	
	private int employeeId;
	private List<MobileProjectApplicationResponseDTO> projectApplicationSprint;
	private String message;
	
}
