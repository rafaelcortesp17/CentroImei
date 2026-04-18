package com.mx.centro.imei.models.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "registration_tokens")
public class RegistrationToken {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = true)
	private String rol;
	
	@Column(nullable = false, unique = true)
	private String token;
	
	@Column(nullable = false)
	private String email;
	
	@Column(nullable = false, name="expiry_date")
	private LocalDateTime expiryDate;
	
	private boolean used = false;
	
	public RegistrationToken() {}
	
	public RegistrationToken(String token, String email, String rol,int expiryHours) {
        this.token = token;
        this.email = email;
        this.rol = "ROLE_" + rol;
        this.expiryDate = LocalDateTime.now().plusHours(expiryHours);
    }
	

}
