package com.mx.centro.imei.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mx.centro.imei.models.dto.MailRequestDto;
import com.mx.centro.imei.models.entity.RecoveryPass;
import com.mx.centro.imei.models.entity.UserModel;
import com.mx.centro.imei.service.email.IEmailService;

@RestController
@RequestMapping("api/v1/mail")
public class MailController {
	
	@Autowired
	private IEmailService iEmailService;
	
	@PostMapping("/send")
	public ResponseEntity<?> envioCorreo(@RequestBody MailRequestDto mailRequestDto) {
		
		try {
			UserModel usuarioExistente = iEmailService.validateIsExistMail(mailRequestDto.getCorreo());
			if (usuarioExistente == null) {
	            return new ResponseEntity<>("El Email no esta registrado en el sistema", HttpStatus.NOT_FOUND);
	        }
			String code = iEmailService.generateCode();
			if (code == null || code.isEmpty()) {
	            return new ResponseEntity<>("Error al generar el código de seguridad", HttpStatus.INTERNAL_SERVER_ERROR);
	        }
			RecoveryPass recovery = new RecoveryPass();
			recovery.setCodigo(code);
			recovery.setUser(usuarioExistente);
			RecoveryPass recoverySave = iEmailService.saveCode(recovery);
			if(recoverySave != null) {
				System.out.println("Comienza con el envio de correo..");
				iEmailService.enviarCodigoRecuperacion(mailRequestDto.getCorreo(), code);
				return ResponseEntity.ok(Map.of("message", "Correo enviado con éxito"));
			}
			return new ResponseEntity<>("No se pudo procesar la solicitud", HttpStatus.CONFLICT);
			
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Send Email:::" + e.getMessage());
		}
	}
	
	@PostMapping("/verify-code")
	public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> request) {
	    String correo = request.get("correo");
	    String codigo = request.get("code");

	    try {
	    	Boolean esValido = iEmailService.validateRecoveryCode(correo, codigo);
	        
	        if (esValido) {
	            // Si es válido, respondemos con un true o un mensaje de éxito
	            return new ResponseEntity<>(true, HttpStatus.OK);
	        } else {
	            // Si el código expiró o está mal, mandamos un error 401 o 400
	            return new ResponseEntity<>("Código inválido o expirado. Favor de reenviar el código por email", HttpStatus.UNAUTHORIZED);
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Error al validar código: " + e.getMessage());
	    }
	    
	  //valida que no haya expirado el codigo(tiene vigencia de 10 mins)
//		Boolean isValidToken = iEmailService.validateRecoveryCode(mailRequestDto.getCorreo(),code);
	}
	
	@PutMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
	    String correo = request.get("correo");
	    String nuevaPassword = request.get("password");
	    
	    if (correo == null || nuevaPassword == null || nuevaPassword.isEmpty()) {
	        return ResponseEntity.badRequest().body(Map.of("message", "Datos incompletos"));
	    }

	    try {
	    	if(iEmailService.updatePassword(correo,nuevaPassword)) {
	    		return ResponseEntity.ok(Map.of("message", "¡Contraseña actualizada con éxito!"));
	    	}else {
	    		return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                    .body(Map.of("No se pudo actualizar el Password. No se encontró el usuario asociado a este correo", HttpStatus.CONFLICT));
	    	}
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error interno: " + e.getMessage()));
	    }
	}

}
