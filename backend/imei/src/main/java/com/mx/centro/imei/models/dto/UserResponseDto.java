package com.mx.centro.imei.models.dto;

import lombok.Data;

@Data
public class UserResponseDto {
	
	private Long id;
	private String email;
	private String nombre;
	private String apellidoPaterno;
	private String apellidoMaterno;
	private String direccion;
	private String telefono;
	private String role;
	private Long loginUsuarioId;
	private String estatusLoginUsuario;
	private String estatusPersona;

}
