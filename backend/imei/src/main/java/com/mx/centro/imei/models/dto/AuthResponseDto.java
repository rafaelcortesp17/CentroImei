package com.mx.centro.imei.models.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthResponseDto {
	
	String token;
	String refreshToken;
	private String username;
    private List<String> roles;

}
