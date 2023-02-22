package com.stg.tsm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserStoryResponseDTO {
	
	private UserstoryCreateDTO userstory;
	private String message;
	private int status;

}
