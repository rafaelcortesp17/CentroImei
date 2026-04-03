package com.mx.centro.imei.models.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "login_usuario")
public class UserModel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Para que Postgres maneje el ID serial
	private Long id;
	private String email;
	@Column(name="username")
	private String name;
	@Column(name="pass")
	private String password;
	@Column(name = "estatus")
	private Integer estatus;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rol_id")
	private Roles rol;
	
	@OneToOne(mappedBy = "user")
	private RecoveryPass recoverysPass;
}
