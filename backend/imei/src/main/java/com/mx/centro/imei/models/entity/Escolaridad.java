package com.mx.centro.imei.models.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "escolaridad")
public class Escolaridad {
	
	@Getter @Setter
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Para que Postgres maneje el ID serial
	private Long id;
	private String escolaridad;
	private String descripcion;
	private Boolean estatus;	
}
