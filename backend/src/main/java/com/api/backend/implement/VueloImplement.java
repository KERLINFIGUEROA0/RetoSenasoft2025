package com.api.backend.implement;

import com.api.backend.config.VueloMapper;
import com.api.backend.dto.BusquedaVueloRequest;
import com.api.backend.dto.VueloDTO;
import com.api.backend.entity.Vuelo;
import com.api.backend.repository.VueloRepository;
import com.api.backend.service.VueloService;
import com.api.backend.speficication.VueloSpecification;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class VueloImplement implements VueloService {

    @Autowired
    private VueloRepository vueloRepository;

    @Autowired
    private VueloMapper vueloMapper;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public List<VueloDTO> buscarVuelos(BusquedaVueloRequest request) {
        // Construir la especificación combinando múltiples filtros
        Specification<Vuelo> spec = Specification.allOf(
                VueloSpecification.conOrigen(request.getOrigen()),
                VueloSpecification.conDestino(request.getDestino()),
                VueloSpecification.conFechaSalida(request.getFechaSalida()),
                VueloSpecification.vuelosFuturos());

        // Aplicar filtros opcionales
        if (request.getCantidadPasajeros() != null && request.getCantidadPasajeros() > 0) {
            spec = spec.and(VueloSpecification.conAsientosDisponibles(request.getCantidadPasajeros()));
        }

        if (request.getPrecioMinimo() != null || request.getPrecioMaximo() != null) {
            spec = spec.and(VueloSpecification.conRangoPrecios(
                    request.getPrecioMinimo(),
                    request.getPrecioMaximo()
            ));
        }

        // Aplicar ordenamiento
        if (request.getOrdenarPor() != null) {
            switch (request.getOrdenarPor().toLowerCase()) {
                case "precio_asc":
                    spec = spec.and(VueloSpecification.ordenarPorPrecioAsc());
                    break;
                case "precio_desc":
                    spec = spec.and(VueloSpecification.ordenarPorPrecioDesc());
                    break;
                case "duracion":
                    spec = spec.and(VueloSpecification.ordenarPorDuracion());
                    break;
                case "fecha":
                default:
                    spec = spec.and(VueloSpecification.ordenarPorFechaSalida());
                    break;
            }
        } else {
            // Ordenamiento por defecto: por fecha de salida
            spec = spec.and(VueloSpecification.ordenarPorFechaSalida());
        }

        List<Vuelo> vuelos = vueloRepository.findAll(spec);

        return vuelos.stream()
                .map(vueloMapper::toDTO)
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
                .map(vueloMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VueloDTO> listarVuelosFuturos() {
        Specification<Vuelo> spec = VueloSpecification.vuelosFuturos()
                .and(VueloSpecification.ordenarPorFechaSalida());

        return vueloRepository.findAll(spec).stream()
                .map(vueloMapper::toDTO)
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

        // Calcular asientos disponibles
        Long asientosDisponibles = vueloRepository.countAsientosDisponiblesByVuelo(vuelo.getIdVuelo());
        dto.setAsientosDisponibles(asientosDisponibles != null ? asientosDisponibles.intValue() : 0);

        return dto;
    }
}