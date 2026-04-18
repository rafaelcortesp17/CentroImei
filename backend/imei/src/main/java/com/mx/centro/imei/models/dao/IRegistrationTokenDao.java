package com.mx.centro.imei.models.dao;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mx.centro.imei.models.entity.RegistrationToken;

@Repository
public interface IRegistrationTokenDao extends JpaRepository<RegistrationToken, Long>{
	
	public Optional<RegistrationToken> findByToken(String token);
	
	public void deleteByExpiryDateBeforeOrUsedTrue(LocalDateTime now);

}
