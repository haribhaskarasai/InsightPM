package com.stg.tsm.dto;

import java.time.LocalTime;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EffortsRecordDTO {
	
	private int userstoryId;
	private String userstoryName;
	private Date date;
	private String activity;
	private LocalTime effortsSpent;

}
