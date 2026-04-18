package com.mx.centro.imei.service.users;

import com.mx.centro.imei.models.entity.UserModel;

public interface IUsersCrudService {
	
	public UserModel getUserInfoByEmail(String email);

}
