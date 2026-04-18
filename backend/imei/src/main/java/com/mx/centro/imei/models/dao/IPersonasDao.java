package com.mx.centro.imei.models.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mx.centro.imei.models.entity.Personas;

public interface IPersonasDao extends JpaRepository<Personas, Long>{

}
