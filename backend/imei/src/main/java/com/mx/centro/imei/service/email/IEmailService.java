package com.mx.centro.imei.service.email;

import com.mx.centro.imei.models.entity.RecoveryPass;
import com.mx.centro.imei.models.entity.UserModel;

public interface IEmailService {
	
	public void enviarCodigoRecuperacion(String correo, String codigo);
	
	public UserModel validateIsExistMail(String correo);
	
	public String generateCode();
	
	public RecoveryPass saveCode(RecoveryPass recovery);
	
	public Boolean validateRecoveryCode(String email, String code);

}
