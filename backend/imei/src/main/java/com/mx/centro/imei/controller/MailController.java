package com.mx.centro.imei.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mx.centro.imei.models.dto.MailRequestDto;
import com.mx.centro.imei.models.entity.RecoveryPass;
import com.mx.centro.imei.models.entity.UserModel;
import com.mx.centro.imei.service.email.IEmailService;

@Controller
@RequestMapping("api/v1/mail")
public class MailController {
	
	@Autowired
	private IEmailService iEmailService;
	
	@PostMapping("/send")
	public ResponseEntity<?> envioCorreo(@RequestBody MailRequestDto mailRequestDto) {
		
		try {
			UserModel usuarioExistente = iEmailService.validateIsExistMail(mailRequestDto.getCorreo());
			if(usuarioExistente != null) {
				String code = iEmailService.generateCode();
				if(!code.equals("") && code != null) {
					RecoveryPass recovery = new RecoveryPass();
					recovery.setCodigo(code);
					System.out.println("fecha y hora de expiracion" + LocalDateTime.now().plusMinutes(10));
					recovery.setExpiryDate(LocalDateTime.now().plusMinutes(10));//10 mins de vida
					recovery.setUser(usuarioExistente);
					RecoveryPass recoverySave = iEmailService.saveCode(recovery);
					if(recoverySave != null) {
						//valida que no haya expirado el codigo(tiene vigencia de 10 mins)
						Boolean isValidToken = iEmailService.validateRecoveryCode(mailRequestDto.getCorreo(),code);
						if(isValidToken) {
							System.out.println("Comienza con el envio de correo..");
							iEmailService.enviarCodigoRecuperacion(mailRequestDto.getCorreo(), code);
						}else {
							return new ResponseEntity<>("El Codigo ha vencido, reintentar nuevamente la recuperacion de contraseña", HttpStatus.CONFLICT);
						}
					}
				}else {
					return new ResponseEntity<>("El Codigo no se genero correctamente", HttpStatus.CONFLICT);
				}
			}else {
				return new ResponseEntity<>("El Email no esta registrado en el sistema", HttpStatus.CONFLICT);
			}
			return new ResponseEntity<MailRequestDto>(mailRequestDto, HttpStatus.OK);
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Send Email:::" + e.getMessage());
		}
	}

}
