package com.api.backend.dto;

import com.api.backend.config.enums.CiudadesEnum;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BusquedaVueloRequest {

    private CiudadesEnum origen;
    private CiudadesEnum destino;
    private LocalDate fechaSalida;
    private LocalDate fechaRegreso; // Opcional para viajes de ida y vuelta
    private Integer cantidadPasajeros;
    private String tipoViaje; // "IDA", "IDA_VUELTA"
}