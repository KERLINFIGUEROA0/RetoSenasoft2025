package com.api.backend.service;

import com.api.backend.dto.ConfirmacionReservaDTO;
import com.api.backend.dto.GenerarTiqueteRequest;
import com.api.backend.dto.TiqueteDTO;

import java.util.List;

public interface TiqueteService {

    List<TiqueteDTO> generarTiquetes(Long idReserva);

    ConfirmacionReservaDTO obtenerConfirmacionReserva(Long idReserva);

    byte[] descargarTiquetePDF(Long idTiquete);

    String descargarTiqueteJSON(Long idTiquete);

    String generarCodigoReservaUnico();
}