package com.stg.tsm.service;

import com.stg.tsm.dto.ChangePasswordResponseDTO;
import com.stg.tsm.dto.CreateUserStoryResponseDTO;
import com.stg.tsm.dto.MobileAuthenticationResponseDTO;
import com.stg.tsm.dto.MobileUserStoryResopnseDto;
import com.stg.tsm.dto.ResetPasswordDTO;
import com.stg.tsm.dto.UserstoryCreateDTO;
import com.stg.tsm.entity.EmployeeDetail;
import com.stg.tsm.entity.UserstoryMaster;
import com.stg.tsm.exception.MobileTsmException;
import com.stg.tsm.exception.TsmException;

public interface MobileAppService {
    
    MobileAuthenticationResponseDTO getEmployeeData(EmployeeDetail employeeDetailTemp) throws TsmException; 
    
    ChangePasswordResponseDTO changePassword(ResetPasswordDTO resetPasswordDTO) throws MobileTsmException;
    
    CreateUserStoryResponseDTO createUserstoryMaster(int sprintId, UserstoryCreateDTO userstoryMaster) throws MobileTsmException;
    
    MobileUserStoryResopnseDto getUserstoryMasterList(int sprintId) throws MobileTsmException;
    
    String updateUserstoryMaster(UserstoryMaster UserstoryMaster) throws TsmException;

}
