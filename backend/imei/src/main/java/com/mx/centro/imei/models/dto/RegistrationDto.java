package com.mx.centro.imei.models.dto;

import lombok.Data;

@Data
public class RegistrationDto {
	
	private String token;
	private String password;
	
	private PersonalData personalData;

	@Data
	public static class PersonalData{
		private String nombre;
		private String apellidoPaterno;
		private String apellidoMaterno;
		private String direccion;
		private String telefono;
	}

}
