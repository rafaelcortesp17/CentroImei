package com.mx.centro.imei.models.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mx.centro.imei.models.entity.UserModel;

public interface ILoginUsuarioDao extends JpaRepository<UserModel,Long>{
	
	@Query("SELECT u FROM UserModel u WHERE u.email = :email")
	public UserModel findByEmail(@Param("email") String email);

}
