package com.mx.centro.imei.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "Login_usuario")
public class UserModel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Para que Postgres maneje el ID serial
	Long id;
	@Column(name="username")
	String name;
	@Column(name="pass")
	String password;
	String role;

}
