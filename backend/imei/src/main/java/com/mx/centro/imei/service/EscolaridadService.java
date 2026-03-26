package com.mx.centro.imei.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mx.centro.imei.entity.Escolaridad;
import com.mx.centro.imei.repository.EscolaridadRepository;

@Service
public class EscolaridadService {
	
	@Autowired
	private EscolaridadRepository repository;
	
	public Escolaridad guardar(Escolaridad escolaridad) {
		return repository.save(escolaridad);
	}
	
	public List<Escolaridad> obtenerTodas(){
		return repository.findAll();
	}

}
