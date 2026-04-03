package com.mx.centro.imei.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthResponseDto {
	
	String token;
	String refreshToken;

}
