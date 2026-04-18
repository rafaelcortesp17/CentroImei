package com.mx.centro.imei.service.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mx.centro.imei.models.entity.UserModel;
import com.mx.centro.imei.repository.user.UserRepository;

@Service
public class IUsersCrudServiceImpl implements IUsersCrudService{

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserModel getUserInfoByEmail(String email) {
		return this.userRepository.findByEmailConRol(email);
	}
	
	

}
