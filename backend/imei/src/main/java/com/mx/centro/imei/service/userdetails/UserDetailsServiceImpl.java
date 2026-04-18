package com.mx.centro.imei.service.userdetails;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


import com.mx.centro.imei.models.entity.UserModel;
import com.mx.centro.imei.repository.user.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		
		System.out.println("implementa UserDetailsService");
		
		UserModel userModel = this.userRepository.findByEmailConRol(email);
		if(userModel == null) {
            throw  new UsernameNotFoundException("Usuario no encontrado: " + email);
        }
		
		// Creamos la autoridad con el prefijo ROLE_
        // Si tu rol en BD es "ADMIN", aquí se vuelve "ROLE_ADMIN"
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userModel.getRol().getNombre());

        // Devolvemos el User de Spring con su rol cargado
        return org.springframework.security.core.userdetails.User.builder()
                .username(userModel.getEmail())
                .password(userModel.getPassword())
                .authorities(List.of(authority))
                .build();
		
//		return new User(userModel.getName(), userModel.getPassword(), new ArrayList<>());
	}

	
}
