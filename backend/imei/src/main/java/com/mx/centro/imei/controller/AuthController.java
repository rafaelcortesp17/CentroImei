package com.mx.centro.imei.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mx.centro.imei.dto.AuthRequestDto;
import com.mx.centro.imei.dto.AuthResponseDto;
import com.mx.centro.imei.entity.UserModel;
import com.mx.centro.imei.repository.user.UserRepository;
import com.mx.centro.imei.service.jwt.JwtUtilService;


@Controller
@RequestMapping("api/v1/auth")
public class AuthController {
	
	@Autowired
    private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Autowired
	private JwtUtilService jwtUtilService;
	
	@Autowired
	private UserRepository userRepository;
	
	@PostMapping("/login")
    public ResponseEntity<?> auth(@RequestBody AuthRequestDto authRequestDto) {

		try {
			//1. Gestion authenticationManager
			this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
	                authRequestDto.getUser(), authRequestDto.getPassword()
	        ));
			//2. Validar el usuario en la bd
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(authRequestDto.getUser());
			UserModel userModel = this.userRepository.findByname(authRequestDto.getUser());
			
			//3. Generar token
			String jwt = this.jwtUtilService.generateToken(userDetails,userModel.getRole());
			String refreshToken = this.jwtUtilService.generateRefreshToken(userDetails,userModel.getRole());
			
			AuthResponseDto authResponseDto = new AuthResponseDto();
            authResponseDto.setToken(jwt);
            authResponseDto.setRefreshToken(refreshToken);
			
			return new ResponseEntity<AuthResponseDto>(authResponseDto, HttpStatus.OK);
		
		}catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error Authetication:::" + e.getMessage());
	    }

	}
	
	@PostMapping("/refresh")
    public ResponseEntity<?> auth(@RequestBody Map<String, String> request) {
		String refreshToken = request.get("refreshToken");

		try {
			
			String username = this.jwtUtilService.extractUsername(refreshToken);
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
			UserModel userModel = this.userRepository.findByname(username);
			
			if(this.jwtUtilService.validateToken(refreshToken, userDetails)) {
				String newJwt = this.jwtUtilService.generateToken(userDetails, userModel.getRole());
				String newRefreshToken = this.jwtUtilService.generateRefreshToken(userDetails, userModel.getRole());
				
				AuthResponseDto authResponseDto = new AuthResponseDto();
				authResponseDto.setToken(newJwt);
				authResponseDto.setRefreshToken(newRefreshToken);
				return new ResponseEntity<>(authResponseDto, HttpStatus.OK);
			}else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
			}
		
		}catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error Refresh Token:::" + e.getMessage());
	    }

	}
}
