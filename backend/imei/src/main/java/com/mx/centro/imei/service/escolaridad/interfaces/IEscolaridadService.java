package com.mx.centro.imei.service.escolaridad.interfaces;

import java.util.List;

import com.mx.centro.imei.entity.Escolaridad;

public interface IEscolaridadService {
	
public List<Escolaridad> obtenerTodas();

public Escolaridad guardar(Escolaridad escolaridad);

}
