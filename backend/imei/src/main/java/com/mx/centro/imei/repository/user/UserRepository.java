package com.mx.centro.imei.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;


import com.mx.centro.imei.entity.UserModel;

public interface UserRepository extends JpaRepository<UserModel,Integer>{
	
	public UserModel findByname(String user);
}
