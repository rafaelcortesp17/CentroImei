package com.mx.centro.imei.models.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name="recovery_pass")
public class RecoveryPass {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String codigo;
	@Column(name = "date")
	private LocalDateTime expiryDate;
	
	@OneToOne
	@JoinColumn(name = "login_usuario_id", referencedColumnName = "id")
	private UserModel user;
	
	// Método para verificar si el código expiró
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

}
