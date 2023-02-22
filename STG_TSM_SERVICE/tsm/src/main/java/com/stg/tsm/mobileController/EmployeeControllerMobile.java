package com.stg.tsm.mobileController;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import com.stg.tsm.dto.AuthenticationMobileResponse;
import com.stg.tsm.dto.AuthenticationRequest;
import com.stg.tsm.dto.ChangePasswordResponseDTO;
import com.stg.tsm.dto.MobileAuthenticationResponseDTO;
import com.stg.tsm.dto.MobileLoginResponseDTO;
import com.stg.tsm.dto.ResetPasswordDTO;
import com.stg.tsm.entity.EmployeeDetail;
import com.stg.tsm.exception.MobileTsmException;
import com.stg.tsm.exception.TsmException;
import com.stg.tsm.repos.EmployeeDetailRepository;
import com.stg.tsm.security.CustomUserDetailsService;
import com.stg.tsm.security.JwtUtil;
import com.stg.tsm.service.MobileAppService;

@RestController
@RequestMapping("/mobile/employee")
public class EmployeeControllerMobile {
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private EmployeeDetailRepository employeeDetailRepository;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private MobileAppService mobileAppService;
    

    @Autowired
    private AuthenticationManager authenticationManager;
    
    
    @PostMapping(value = "/authenticate")
    public ResponseEntity<MobileLoginResponseDTO> createAuthenticationToken(
            @RequestBody AuthenticationRequest authenticationRequest) throws TsmException {
    	String message = "";
    	try {

        EmployeeDetail employeeDetailTemp = employeeDetailRepository.findByEmail(authenticationRequest.getEmail());

        UserDetails userDetails;
        if (employeeDetailTemp != null) {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(employeeDetailTemp.getUsername(),
                    authenticationRequest.getPassword()));

            userDetails = customUserDetailsService
                    .loadUserByUsername(employeeDetailTemp.getUsername());
        } else {
        	message = "Invalid Email Id";
//            throw new BadCredentialsException("Invalid Email Id");
        	return new ResponseEntity<>(new MobileLoginResponseDTO(null, message),HttpStatus.OK);
        }


        final String jwt = jwtUtil.generateToken(userDetails);
        final MobileAuthenticationResponseDTO employeeResponseDto = mobileAppService.getEmployeeData(employeeDetailTemp);
        
        AuthenticationMobileResponse authenticationMobileResponse = new AuthenticationMobileResponse(jwt, employeeResponseDto);

        return new ResponseEntity<>(new MobileLoginResponseDTO(authenticationMobileResponse, "Successfull"),HttpStatus.OK);
    	}catch (BadCredentialsException e) {
			// TODO: handle exception
    		message = "Invalid password";
    		return new ResponseEntity<>(new MobileLoginResponseDTO(null, message),HttpStatus.OK); 
		}
    }
    
    
    @PostMapping(value = "/changePassword", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChangePasswordResponseDTO> changePassword(@RequestBody ResetPasswordDTO resetPasswordDTO) throws MobileTsmException {
	    return new ResponseEntity<>(mobileAppService.changePassword(resetPasswordDTO), HttpStatus.OK);
	   }
    
    
    

}
