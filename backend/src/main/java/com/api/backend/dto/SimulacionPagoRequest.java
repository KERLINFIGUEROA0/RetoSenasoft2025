package com.api.backend.dto;

import lombok.Data;

@Data
public class SimulacionPagoRequest {

    private Long idReserva;
    private String metodoPago; // "TARJETA_CREDITO", "TARJETA_DEBITO", "PSE"
    private String correoPagador;
    private String telefonoPagador;
    private boolean terminosAceptados;
}