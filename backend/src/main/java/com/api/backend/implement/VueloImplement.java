package com.api.backend.implement;

import com.api.backend.dto.BusquedaVueloRequest;
import com.api.backend.dto.VueloDTO;
import com.api.backend.entity.Vuelo;
import com.api.backend.repository.VueloRepository;
import com.api.backend.service.VueloService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VueloImplement implements VueloService {

    @Autowired
    private VueloRepository vueloRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<VueloDTO> buscarVuelos(BusquedaVueloRequest request) {
        // Validar fecha de búsqueda según requerimientos
        if (!validarFechaBusqueda(request)) {
            throw new IllegalArgumentException("Fecha de búsqueda inválida. Debe ser desde hoy hasta máximo 2 meses en el futuro.");
        }

        // Convertir LocalDate a LocalDateTime para la búsqueda
        LocalDateTime fechaInicio = request.getFechaSalida().atStartOfDay();
        LocalDateTime fechaFin = request.getFechaSalida().atTime(LocalTime.MAX);
        LocalDateTime ahora = LocalDateTime.now();

        List<Vuelo> vuelos = vueloRepository.findVuelosDisponibles(
            request.getOrigen(),
            request.getDestino(),
            fechaInicio,
            ahora
        );

        return vuelos.stream()
            .map(this::convertirAVueloDTO)
            .collect(Collectors.toList());
    }

    @Override
    public VueloDTO buscarVueloPorId(Long id) {
        Vuelo vuelo = vueloRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vuelo no encontrado"));
        return convertirAVueloDTO(vuelo);
    }

    @Override
    public List<VueloDTO> listarTodos() {
        return vueloRepository.findAll().stream()
            .map(this::convertirAVueloDTO)
            .collect(Collectors.toList());
    }

    @Override
    public boolean validarFechaBusqueda(BusquedaVueloRequest request) {
        LocalDate hoy = LocalDate.now();
        LocalDate maxFecha = hoy.plusMonths(2);

        return request.getFechaSalida() != null &&
               !request.getFechaSalida().isBefore(hoy) &&
               !request.getFechaSalida().isAfter(maxFecha);
    }

    private VueloDTO convertirAVueloDTO(Vuelo vuelo) {
        VueloDTO dto = modelMapper.map(vuelo, VueloDTO.class);

        // Agregar información del avión
        if (vuelo.getAvion() != null) {
            dto.setModeloAvion(vuelo.getAvion().getModelo());
            dto.setCapacidadAvion(vuelo.getAvion().getCapacidad());
        }

        // Calcular asientos disponibles
        Long asientosDisponibles = vueloRepository.countAsientosDisponiblesByVuelo(vuelo.getIdVuelo());
        dto.setAsientosDisponibles(asientosDisponibles != null ? asientosDisponibles.intValue() : 0);

        return dto;
    }
}