package com.mx.centro.imei.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/home")
public class HomeController {
	
	@GetMapping("/admin-stats")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<?> getAdminStats(){
		return ResponseEntity.ok("Datos mega seguros con acceso solo para Admin");
	}
	
	@PostMapping("/perfil-general")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_TEACHER','ROLE_STUDENT')")
	public ResponseEntity<?> getProfileInfo(@RequestBody Map<String, String> request){
		String username = request.get("username");
		return ResponseEntity.ok(Map.of("mensaje", "Informacion basica para: " + username));
	}

}
