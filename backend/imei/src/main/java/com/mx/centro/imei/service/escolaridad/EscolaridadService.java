package com.mx.centro.imei.service.escolaridad;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mx.centro.imei.models.entity.Escolaridad;
import com.mx.centro.imei.repository.escolaridad.EscolaridadRepository;
import com.mx.centro.imei.service.escolaridad.interfaces.IEscolaridadService;

@Service
public class EscolaridadService implements IEscolaridadService {
	
	@Autowired
	private EscolaridadRepository escolaridadRepository;
	
	@Override
	public List<Escolaridad> obtenerTodas(){
		return escolaridadRepository.findAll();
	}
	
	@Override
	public Escolaridad guardar(Escolaridad escolaridad) {
		return escolaridadRepository.save(escolaridad);
	}
	

}
