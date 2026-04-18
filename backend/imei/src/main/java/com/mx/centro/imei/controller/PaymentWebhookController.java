package com.mx.centro.imei.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mx.centro.imei.models.dto.PaymentWebhookDto;
import com.mx.centro.imei.service.registration.token.RegistrationService;

@RestController
@RequestMapping("/api/v1/webhooks")
public class PaymentWebhookController {
	
	@Value("${payments.webhook.secret}")
    private String endpointSecret;

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/stripe")
    public ResponseEntity<String> handlePaymentWebhook(
            @RequestBody String payload, // Recibimos el body como String para validar la firma
            @RequestHeader("Stripe-Signature") String sigHeader) {

        // --- INICIO DE VALIDACIÓN---
        // Descomentar cuando se aplique lo de la pasarela de pago
//        boolean isValid = validateSignature(payload, sigHeader);
//        if (!isValid) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Firma inválida");
//        }
        // --- FIN DE VALIDACIÓN ---

        // Mapear el JSON a nuestro DTO (usando Jackson)
        ObjectMapper mapper = new ObjectMapper();
        try {
            PaymentWebhookDto event = mapper.readValue(payload, PaymentWebhookDto.class);
            
            if ("payment_intent.succeeded".equals(event.getType())) {
                String email = event.getData().getCustomer_email();
                
                // Aquí inicia tu flujo de UUID y Token
                registrationService.createInvitationAfterPayment(email,"ROL_STUDENT");
            }
            
            return ResponseEntity.ok("Evento procesado ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private boolean validateSignature(String payload, String sigHeader) {
        // En producción, aquí usas la librería de la pasarela:
        // Webhook.constructEvent(payload, sigHeader, endpointSecret);
        
        // Para tu MOCK actual:
        return true; 
    }

}
