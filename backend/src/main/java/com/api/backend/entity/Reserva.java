package com.api.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reservas")
@Data
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReserva;

    private LocalDateTime fecha;

    @OneToOne
    @JoinColumn(name = "id_pago")
    private Pago pago;

    @OneToMany(mappedBy = "reserva")
    private List<Pasajero> pasajeros;

    @OneToMany(mappedBy = "reserva")
    private List<Tiquete> tiquetes;

    private String codigoReserva; // Código único para la reserva completa
}
