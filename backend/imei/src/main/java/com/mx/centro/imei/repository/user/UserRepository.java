package com.mx.centro.imei.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mx.centro.imei.models.entity.UserModel;

public interface UserRepository extends JpaRepository<UserModel,Long>{
	
	public UserModel findByname(String user);
	
	@Query("SELECT usuario FROM UserModel usuario JOIN FETCH usuario.rol WHERE usuario.name = :name AND usuario.estatus = 1")
	public UserModel findByUsuarioConRol(@Param("name") String name);
	
}
