package com.mx.centro.imei.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mx.centro.imei.models.dao.IRegistrationTokenDao;
import com.mx.centro.imei.models.dto.RegistrationDto;
import com.mx.centro.imei.models.entity.RegistrationToken;
import com.mx.centro.imei.service.registration.token.RegistrationService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/v1/commons")
public class CommonsController {
	
	@Autowired
	private IRegistrationTokenDao iRegistrationTokenDao;
	
	@Autowired
	private RegistrationService registrationService;

	@GetMapping("/verify-token")
	public ResponseEntity<?> verify(@RequestParam String token) {
	    Optional<RegistrationToken> t = iRegistrationTokenDao.findByToken(token);
	    
	    if (t.isPresent()) {
	        System.out.println("Expiry en BD: " + t.get().getExpiryDate());
	        System.out.println("Ahora: " + LocalDateTime.now());
	        System.out.println("¿Válido?: " + t.get().getExpiryDate().isAfter(LocalDateTime.now()));
	        System.out.println("¿Usado?: " + t.get().isUsed());
	    } else {
	        System.out.println("Token no encontrado en BD");
	        return ResponseEntity.status(HttpStatus.GONE).body(Map.of("message", "Token no encontrado en BD"));
	    }
	    
	    if (t.isPresent() && !t.get().isUsed() && t.get().getExpiryDate().isAfter(LocalDateTime.now())) {
	        return ResponseEntity.ok().build();
	    }
	    return ResponseEntity.status(HttpStatus.GONE).body(Map.of("message", "Token inválido o expirado"));
	}
	
	@PostMapping("/finalize")
	public ResponseEntity<?> finalizeRegistration(@RequestBody RegistrationDto request){
		try {
            registrationService.confirmAndCreateUser(request);
            return ResponseEntity.ok(Map.of("message", "Usuario creado exitosamente"));

        } catch (EntityNotFoundException e) {
            // Retorna 404 si el token no existe
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            // Retorna 400 si el token expiró o ya se usó
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));

        } catch (Exception e) {
            // Retorna 500 para cualquier otro error (DB, conexión, etc.)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error interno al procesar el registro, "
            		+ "Reintentelo más tarde o en su defecto contacte al Administrador para que le reenvie la url para nuevamente intentar el registro "));
        }
	}
	
}
