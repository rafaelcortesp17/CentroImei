package com.mx.centro.imei.models.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.mx.centro.imei.models.entity.RecoveryPass;

public interface ITokenRepositoryDao extends JpaRepository<RecoveryPass, Long>{
	
	public List<RecoveryPass> findAll();
	
	@Query("SELECT r FROM RecoveryPass r JOIN FETCH r.user u WHERE u.email = :email AND r.codigo = :codigo")
	public Optional<RecoveryPass> findByEmailAndCodigo(@Param("email") String email, @Param("codigo") String codigo);
	
	@Transactional
    @Modifying
    @Query("DELETE FROM RecoveryPass r WHERE r.expiryDate < :fecha")
	public int deleteAllExpiredSince(@Param("fecha") LocalDateTime fecha);

}
