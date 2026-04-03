package com.mx.centro.imei.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mx.centro.imei.models.entity.Escolaridad;
import com.mx.centro.imei.service.escolaridad.interfaces.IEscolaridadService;

@Controller
@CrossOrigin("*")
@RequestMapping("/api/v1/escolaridad") // Esta será la base de tu URL
public class EscolaridadController {
	
	@Autowired
	private IEscolaridadService iEscolaridadService;
	
	@PostMapping("/guardar")
	public ResponseEntity<?> crearEscolaridad(@RequestBody Escolaridad escolaridad){
		//se llama al servicio que probo en el test
		return ResponseEntity.ok(iEscolaridadService.guardar(escolaridad));
	}
	
	@GetMapping("/lista")
	public ResponseEntity<?> listar(){
		List<Escolaridad> escolaridad = this.iEscolaridadService.obtenerTodas();
		return new ResponseEntity<>(escolaridad,HttpStatus.OK);
	}

}
