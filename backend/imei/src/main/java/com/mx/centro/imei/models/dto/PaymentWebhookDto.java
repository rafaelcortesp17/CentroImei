package com.mx.centro.imei.models.dto;

import lombok.Data;

@Data
public class PaymentWebhookDto {
	
	private String type; //ejemplo "payment_intent.succeeded"
	private PaymentData data;
	
	@Data
	public static class PaymentData{
		private String customer_email;
		private Long amount;
		private String id; //es el ID de la transaccion de pasarela de pago
	}

}
