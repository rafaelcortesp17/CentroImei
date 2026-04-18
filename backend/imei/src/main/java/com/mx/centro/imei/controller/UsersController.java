package com.mx.centro.imei.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mx.centro.imei.service.registration.token.RegistrationService;

@RestController
@RequestMapping("/api/v1/admin")
public class UsersController {
	
	@Autowired
    private RegistrationService registrationService;
	
	@PostMapping("/invite")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<?> setPersona(@RequestBody Map<String, String> request){
		String email = request.get("email");
	    String rol = request.get("role");
	    
	    try {
	    	registrationService.createInvitationAfterPayment(email,rol);
	    	return ResponseEntity.ok(Map.of("message", "Se envia Invitación a Usuario con éxito"));
	        
	    } catch (Exception e) {
	    	System.out.println("Error al enviar invitacion " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","Error al enviar invitación por correo." ));
	    }
	    
	}

}
