package com.mx.centro.imei.models.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mx.centro.imei.models.entity.ErrorLog;

public interface IErroresDao extends JpaRepository<ErrorLog,Long> {

}
