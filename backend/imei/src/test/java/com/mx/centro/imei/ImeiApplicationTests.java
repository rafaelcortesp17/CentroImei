package com.mx.centro.imei;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.mx.centro.imei.repository.escolaridad.EscolaridadRepository;

@SpringBootTest
class ImeiApplicationTests {
	
	@Autowired
    private EscolaridadRepository repository; // Tu Repositorio JPA
	
	@Test
    public void testDatabaseConnection() {
        // Lógica de prueba: guardar y buscar
//		Escolaridad entity = new Escolaridad();
//        entity.setEscolaridad("Escolaridad Prueba");
//        entity.setDescripcion("Esto es una prueba");
//        entity.setEstatus(true);
//        repository.save(entity);
        
//        assertThat(repository.findAll()).isNotEmpty();
    }

}
