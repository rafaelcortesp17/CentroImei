package com.mx.centro.imei.service.email;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.mx.centro.imei.models.dao.ITokenRepositoryDao;
import com.mx.centro.imei.exception.CustomMailException;
import com.mx.centro.imei.models.dao.IErroresDao;
import com.mx.centro.imei.models.dao.ILoginUsuarioDao;
import com.mx.centro.imei.models.entity.ErrorLog;
import com.mx.centro.imei.models.entity.RecoveryPass;
import com.mx.centro.imei.models.entity.UserModel;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class IEmailServiceImpl implements IEmailService{
	
	@Autowired
    private JavaMailSender mailSender;
	
	@Autowired
	private ILoginUsuarioDao iLoginUsuarioDao;
	
	@Autowired
	private ITokenRepositoryDao iTokenRepositoryDao;
	
	@Autowired
	private IErroresDao iErroresDao;
	
	@Autowired
    private SecureRandom secureRandom;

	@Async
//	@Retryable(
//	    value = { MailException.class }, 
//	    maxAttempts = 3, 
//	    backoff = @Backoff(delay = 2000, multiplier = 2)
//	)
	@Override
	public void enviarCodigoRecuperacion(String destino, String codigo) {
	  SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(destino);
      message.setSubject("Código de Recuperación de Contraseña");
      message.setText("Tu código de verificación es: " + codigo);
      
      mailSender.send(message);
      log.info("Correo enviado exitosamente a: {}", destino);
	}
	
	@Recover
	public void recover(MailException e, String destino, String codigo) {
	    // Logueamos para el equipo de soporte
	    log.error("Sistema de correos caído tras 3 intentos. Causa: {}", e.getMessage());
	    
	 // Ejemplo: Guardar en DB para reintentar manualmente después
	    ErrorLog error = new ErrorLog();
	    error.setDestinatario(destino);
	    error.setMotivo(e.getMessage());
	    error.setTipo("RECUPERACION_PASSWORD");
	    error.setFecha(LocalDateTime.now());
	    
	    iErroresDao.save(error);
	    
	    // Lanzamos la excepción que atrapará tu GlobalExceptionHandler
	    throw new CustomMailException("Lo sentimos, nuestro servicio de mensajería no responde. Inténtalo más tarde.");
	}

	@Override
	public UserModel validateIsExistMail(String correo) {
		return iLoginUsuarioDao.findByEmail(correo);
	}

	@Override
	public String generateCode() {
		int length = 6;
        StringBuilder code = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            // Genera un número aleatorio entre 0 y 9
            code.append(secureRandom.nextInt(10));
        }
        return code.toString();
	}

	@Override
	public RecoveryPass saveCode(RecoveryPass recovery) {
		return iTokenRepositoryDao.save(recovery);
	}

	@Override
	public Boolean validateRecoveryCode(String email, String code) {
		Optional<RecoveryPass> tokenVen = iTokenRepositoryDao.findByEmailAndCodigo(email,code);
		if (tokenVen.isEmpty()) {
            return false; // El código no existe o no coincide con ese usuario
        }
		RecoveryPass token = tokenVen.get();
		
		if(token.isExpired()) {
			iTokenRepositoryDao.delete(token);
			return false;
		}
		
		return true;
	}
	
	

}
