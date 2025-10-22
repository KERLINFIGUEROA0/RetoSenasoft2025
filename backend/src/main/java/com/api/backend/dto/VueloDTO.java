package com.api.backend.dto;

import com.api.backend.config.enums.CiudadesEnum;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VueloDTO {

    private Long idVuelo;
    private CiudadesEnum origen;
    private CiudadesEnum destino;
    private LocalDateTime fechaSalida;
    private LocalDateTime fechaLlegada;
    private BigDecimal precio;
    private String modeloAvion;
    private Integer capacidadAvion;
    private Integer asientosDisponibles;
    private List<AsientoVueloDTO> asientosVuelos;
}
