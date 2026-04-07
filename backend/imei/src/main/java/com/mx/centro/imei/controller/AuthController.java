package com.mx.centro.imei.controller;

import java.util.List;
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

import com.mx.centro.imei.models.dto.AuthRequestDto;
import com.mx.centro.imei.models.dto.AuthResponseDto;
import com.mx.centro.imei.models.entity.UserModel;
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
			System.out.println("auth RQ "+ authRequestDto.getUser() + " " + authRequestDto.getPassword());
			this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
	                authRequestDto.getUser(), authRequestDto.getPassword()
	        ));
			//2. Validar el usuario en la bd
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(authRequestDto.getUser());
			//UserModel userModel = this.userRepository.findByname(authRequestDto.getUser());
			//nota al crear usuarios se debe definir como unicos(si no fallaria aqui)
			UserModel userModelRol = this.userRepository.findByUsuarioConRol(authRequestDto.getUser());
			
			System.out.println("rol de usuario prueba atraves del jpa: "+ userModelRol.getRol().getNombre());
			System.out.println("estatus: "+ userModelRol.getEstatus());
			
			//3. Generar token
			String jwt = this.jwtUtilService.generateToken(userDetails,userModelRol.getRol().getNombre());
			String refreshToken = this.jwtUtilService.generateRefreshToken(userDetails,userModelRol.getRol().getNombre());
			
			AuthResponseDto authResponseDto = new AuthResponseDto();
            authResponseDto.setToken(jwt);
            authResponseDto.setRefreshToken(refreshToken);
            authResponseDto.setUsername(authRequestDto.getUser());
            
            String nombreRol = userModelRol.getRol().getNombre();
            authResponseDto.setRoles(List.of("ROLE_" + nombreRol));
			
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
			//UserModel userModel = this.userRepository.findByname(username);
			//nota al crear usuarios se debe definir como unicos(si no fallaria aqui)
			UserModel userModelRol = this.userRepository.findByUsuarioConRol(username);
			
			if(this.jwtUtilService.validateToken(refreshToken, userDetails)) {
				String newJwt = this.jwtUtilService.generateToken(userDetails, userModelRol.getRol().getNombre());
				String newRefreshToken = this.jwtUtilService.generateRefreshToken(userDetails, userModelRol.getRol().getNombre());
				
				AuthResponseDto authResponseDto = new AuthResponseDto();
				authResponseDto.setToken(newJwt);
				authResponseDto.setRefreshToken(newRefreshToken);
				authResponseDto.setUsername(username);
				authResponseDto.setRoles(List.of("ROLE_" + userModelRol.getRol().getNombre()));
				return new ResponseEntity<>(authResponseDto, HttpStatus.OK);
			}else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
			}
		
		}catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error Refresh Token:::" + e.getMessage());
	    }

	}
}
