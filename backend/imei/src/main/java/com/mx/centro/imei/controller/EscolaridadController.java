package com.mx.centro.imei.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mx.centro.imei.entity.Escolaridad;
import com.mx.centro.imei.service.EscolaridadService;

@RestController
@RequestMapping("/api/escolaridad") // Esta será la base de tu URL
public class EscolaridadController {
	
	@Autowired
	private EscolaridadService service;
	
	@PostMapping("/guardar")
	public ResponseEntity<?> crearEscolaridad(@RequestBody Escolaridad escolaridad){
		//se llama al servicio que probo en el test
		return ResponseEntity.ok(service.guardar(escolaridad));
	}
	
	@GetMapping
	public List<Escolaridad> listar(){
		return service.obtenerTodas();
	}

}
