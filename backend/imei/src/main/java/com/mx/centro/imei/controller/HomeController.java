package com.mx.centro.imei.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mx.centro.imei.models.dto.UserResponseDto;
import com.mx.centro.imei.models.entity.UserModel;
import com.mx.centro.imei.service.users.IUsersCrudService;

@RestController
@RequestMapping("/api/v1/home")
public class HomeController {
	
	@Autowired
	private IUsersCrudService iUserCrudService;
	
	@GetMapping("/admin-stats")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<?> getAdminStats(){
		return ResponseEntity.ok("Datos mega seguros con acceso solo para Admin");
	}
	
	@PostMapping("/perfil-general")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_TEACHER','ROLE_STUDENT')")
	public ResponseEntity<?> getProfileInfo(@RequestBody Map<String, String> request){
		String email = request.get("email");
		try {
			UserModel userModelRol = iUserCrudService.getUserInfoByEmail(email);
			
			if(userModelRol == null) {
				return new ResponseEntity<>("El Usuario no esta registrado en el sistema", HttpStatus.NOT_FOUND);
			}
			
			UserResponseDto userResponseDto = new UserResponseDto();
			userResponseDto.setEmail(userModelRol.getEmail());
			userResponseDto.setNombre(userModelRol.getPersonas().getNombre());
			userResponseDto.setApellidoPaterno(userModelRol.getPersonas().getApellidoPaterno());
			userResponseDto.setApellidoMaterno(userModelRol.getPersonas().getApellidoMaterno());
			userResponseDto.setDireccion(userModelRol.getPersonas().getDireccion());
			userResponseDto.setTelefono(userModelRol.getPersonas().getTelefono());
			userResponseDto.setRole(userModelRol.getRol().getNombre());
			
			return new ResponseEntity<UserResponseDto>(userResponseDto, HttpStatus.OK);
		}catch(Exception e) {
			//Errores 500
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error interno al recuperar información del Usuario"));
		}
	}

}
