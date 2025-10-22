package com.api.backend.service;

import com.api.backend.dto.BusquedaVueloRequest;
import com.api.backend.dto.VueloDTO;

import java.util.List;

public interface VueloService {

    List<VueloDTO> buscarVuelos(BusquedaVueloRequest request);

    VueloDTO buscarVueloPorId(Long id);

    List<VueloDTO> listarTodos();

    boolean validarFechaBusqueda(BusquedaVueloRequest request);
}