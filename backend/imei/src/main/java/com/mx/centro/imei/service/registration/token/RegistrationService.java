package com.mx.centro.imei.service.registration.token;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mx.centro.imei.models.dao.IPersonasDao;
import com.mx.centro.imei.models.dao.IRegistrationTokenDao;
import com.mx.centro.imei.models.dto.RegistrationDto;
import com.mx.centro.imei.models.entity.Personas;
import com.mx.centro.imei.models.entity.RegistrationToken;
import com.mx.centro.imei.models.entity.Roles;
import com.mx.centro.imei.models.entity.UserModel;
import com.mx.centro.imei.repository.user.UserRepository;
import com.mx.centro.imei.service.email.IEmailServiceImpl;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RegistrationService {
	
	@Autowired
    private IRegistrationTokenDao tokenRepository;

    @Autowired
    private IEmailServiceImpl emailServiceImpl;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
	private UserRepository userRepository;
    
    @Autowired
    private IPersonasDao iPersonasDao;
    
    @Value("${imei.registration.token}")
    private String frontendUrl;
    
    @Transactional
    public void createInvitationAfterPayment(String email,String rol) {
        String uuid = UUID.randomUUID().toString();

        //Crear y guardar el registro (expira en 24 horas)
        RegistrationToken registrationToken = new RegistrationToken(uuid, email,rol, 24);
        tokenRepository.save(registrationToken);

        //Construir la URL para el frontend de Angular
        String activationUrl = frontendUrl + uuid;
        String tipo = "INVITACION_ALTA_USUARIO";
        emailServiceImpl.sendActivationEmail(email, activationUrl, tipo);
    }
    
    @Transactional
    public void confirmAndCreateUser(RegistrationDto request){	
		RegistrationToken regToken = tokenRepository.findByToken(request.getToken()).orElseThrow(() -> new EntityNotFoundException("El token proporcionado no existe en el sistema."));
		
		long idRol = getIdRoleByNameRole(regToken.getRol());
    	
		//se valida que token no este usado o expirado
    	if(regToken.isUsed() || regToken.getExpiryDate().isBefore(LocalDateTime.now())) {
    		throw new IllegalStateException("El enlace ha expirado o ya fue utilizado.");
    	}
    	Roles rol = new Roles();
    	rol.setId(idRol);
    	
    	UserModel newUser = new UserModel();
    	newUser.setEmail(regToken.getEmail());
    	newUser.setPassword(passwordEncoder.encode(request.getPassword()));
    	newUser.setRol(rol);
    	newUser.setEstatus(1);
    	
    	userRepository.save(newUser);
    	//Insercion de datos personales
    	Personas newPersona = new Personas();
    	RegistrationDto.PersonalData dataPersonal =  request.getPersonalData();
        newPersona.setNombre(dataPersonal.getNombre());
        newPersona.setApellidoPaterno(dataPersonal.getApellidoPaterno());
        newPersona.setApellidoMaterno(dataPersonal.getApellidoMaterno());
        newPersona.setDireccion(dataPersonal.getDireccion());
        newPersona.setTelefono(dataPersonal.getTelefono());
        newPersona.setEstatus(1);
        newPersona.setUserRelPersonas(newUser);
        
        iPersonasDao.save(newPersona);
    	
    	//cambiar el token a usado
    	regToken.setUsed(true);
        tokenRepository.save(regToken);
    }
    
    public long getIdRoleByNameRole(String role) {
    	return role.equals("ROLE_ADMIN") ? 1L : role.equals("ROLE_TEACHER") ? 2L : 3L;
    }
	

}
