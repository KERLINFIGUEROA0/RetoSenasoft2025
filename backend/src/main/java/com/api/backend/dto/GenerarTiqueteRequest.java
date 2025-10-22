package com.api.backend.dto;

import lombok.Data;

@Data
public class GenerarTiqueteRequest {

    private Long idReserva;
    private String formato; // "PDF", "JSON"
}