package com.mx.centro.imei.task;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mx.centro.imei.models.dao.ITokenRepositoryDao;

import lombok.extern.slf4j.Slf4j;

@Slf4j // Para llevar un registro en consola
@Component
public class PasswordTokenScheduler {
	
	@Autowired
	private ITokenRepositoryDao iTokenRepositoryDao;
	
	// Se ejecuta cada hora al segundo 0, minuto 0
	@Transactional
	@Scheduled(cron = "0 0 * * * *") // Se ejecuta cada hora
	public void purgeExpiredTokens() {
		
		try {
			log.info("Iniciando limpieza de tokens expirados...");
			
			int deletedCount = iTokenRepositoryDao.deleteAllExpiredSince(LocalDateTime.now());
			
			log.info("Limpieza terminada. Se eliminaron {} tokens caducados.", deletedCount);
		}catch(Exception e){
			log.error("Error al limpiar códigos expirados: {}", e.getMessage());
		}
	}

}
