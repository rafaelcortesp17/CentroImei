package com.mx.centro.imei.repository.escolaridad;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mx.centro.imei.models.entity.Escolaridad;

@Repository
public interface EscolaridadRepository extends JpaRepository<Escolaridad,Integer>{
	
	public List<Escolaridad> findAll();
}
