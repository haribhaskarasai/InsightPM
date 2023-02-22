package com.stg.tsm.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stg.tsm.dto.ResetPasswordDTO;
import com.stg.tsm.entity.EmployeeDetail;
import com.stg.tsm.exception.TsmException;
import com.stg.tsm.repos.EmployeeDetailRepository;
import com.stg.tsm.security.CustomUserDetailsService;
import com.stg.tsm.service.EmployeeService;
import com.stg.tsm.service.MailSender;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeDetailRepository employeeDetailRepository;

    @Autowired
    private CustomUserDetailsService customUserDetails;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailSender mailSender;

    @Override
    public EmployeeDetail resetPassword(ResetPasswordDTO resetPasswordDTO) {

        EmployeeDetail oldEmployee = this.employeeDetailRepository.findByEmail(resetPasswordDTO.getEmployeeEmail());

        EmployeeDetail employeeDetail = new EmployeeDetail();

        employeeDetail.setCreatedBy(oldEmployee.getCreatedBy());
        employeeDetail.setCreatedDate(oldEmployee.getCreatedDate());
        employeeDetail.setEmployeeName(oldEmployee.getEmployeeName());
        employeeDetail.setUsername(oldEmployee.getUsername());
        employeeDetail.setPassword(customUserDetails.passwordEncoder().encode(resetPasswordDTO.getNewPassword()));
        employeeDetail.setEmail(oldEmployee.getEmail());
        employeeDetail.setJoiningDate(oldEmployee.getJoiningDate());
        employeeDetail.setRelievingDate(oldEmployee.getRelievingDate());
        employeeDetail.setUpdatedBy(resetPasswordDTO.getAdminName());
        employeeDetail.setUpdatedDate(oldEmployee.getUpdatedDate());
        employeeDetail.setEmployeeId(oldEmployee.getEmployeeId());

        EmployeeDetail updatedEmployee = employeeDetailRepository.saveAndFlush(employeeDetail);
        //sending mail to user
        mailSender.sendEmailUserForPasswordReset(resetPasswordDTO.getAdminEmail(), resetPasswordDTO.getAdminName(), resetPasswordDTO.getEmployeeEmail(), resetPasswordDTO.getEmployeeName());
        //sending mail to manger
        mailSender.sendEmailProjectMangerForPasswordReset(resetPasswordDTO.getAdminEmail(), resetPasswordDTO.getAdminName(), resetPasswordDTO.getEmployeeEmail(), resetPasswordDTO.getEmployeeName());
        return updatedEmployee;

    }

    @Override
    public EmployeeDetail confirmPassword(ResetPasswordDTO resetPasswordDTO) throws TsmException {
        EmployeeDetail oldEmployee = this.employeeDetailRepository.findByEmail(resetPasswordDTO.getEmployeeEmail());
        EmployeeDetail employeeDetail = new EmployeeDetail();


        if (passwordEncoder.matches(resetPasswordDTO.getOldPassword(), oldEmployee.getPassword())) {

            employeeDetail.setCreatedBy(oldEmployee.getCreatedBy());
            employeeDetail.setCreatedDate(oldEmployee.getCreatedDate());
            employeeDetail.setEmployeeName(oldEmployee.getEmployeeName());
            employeeDetail.setUsername(oldEmployee.getUsername());
            employeeDetail.setPassword(customUserDetails.passwordEncoder().encode(resetPasswordDTO.getNewPassword()));
            employeeDetail.setEmail(oldEmployee.getEmail());
            employeeDetail.setJoiningDate(oldEmployee.getJoiningDate());
            employeeDetail.setRelievingDate(oldEmployee.getRelievingDate());
            employeeDetail.setUpdatedBy(resetPasswordDTO.getAdminName());
            employeeDetail.setUpdatedDate(oldEmployee.getUpdatedDate());
            employeeDetail.setEmployeeId(oldEmployee.getEmployeeId());
            EmployeeDetail employeeDetailsUpdated = employeeDetailRepository.saveAndFlush(employeeDetail);

            mailSender.sendEmailUserPasswordChanged(resetPasswordDTO.getEmployeeEmail(), resetPasswordDTO.getEmployeeName());
            return employeeDetailsUpdated;
        } else {
            throw new TsmException("Password not matched please give Correct old password");
        }

    }

}
