package com.mx.centro.imei.service.userdetails;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mx.centro.imei.models.entity.UserModel;
import com.mx.centro.imei.repository.user.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		UserModel userModel = this.userRepository.findByname(username);
		if(userModel == null) {
            throw  new UsernameNotFoundException(username);
        }
		
		return new User(userModel.getName(), userModel.getPassword(), new ArrayList<>());
	}

	
}
