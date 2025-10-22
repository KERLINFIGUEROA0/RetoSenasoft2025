package com.api.backend.implement;

import com.api.backend.dto.ConfirmacionReservaDTO;
import com.api.backend.dto.TiqueteDTO;
import com.api.backend.entity.Pasajero;
import com.api.backend.entity.Reserva;
import com.api.backend.entity.Tiquete;
import com.api.backend.repository.ReservaRepository;
import com.api.backend.repository.TiqueteRepository;
import com.api.backend.service.TiqueteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TiqueteImplement implements TiqueteService {

    @Autowired
    private TiqueteRepository tiqueteRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public List<TiqueteDTO> generarTiquetes(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        // Generar código único para la reserva si no tiene
        if (reserva.getCodigoReserva() == null) {
            reserva.setCodigoReserva(generarCodigoReservaUnico());
            reservaRepository.save(reserva);
        }

        // Generar tiquetes para cada pasajero
        List<Tiquete> tiquetes = reserva.getPasajeros().stream()
            .map(pasajero -> crearTiqueteParaPasajero(pasajero, reserva))
            .collect(Collectors.toList());

        List<Tiquete> tiquetesGuardados = tiqueteRepository.saveAll(tiquetes);

        return tiquetesGuardados.stream()
            .map(tiquete -> modelMapper.map(tiquete, TiqueteDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    public ConfirmacionReservaDTO obtenerConfirmacionReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        List<Tiquete> tiquetes = tiqueteRepository.findByReservaIdReserva(idReserva);

        ConfirmacionReservaDTO confirmacion = new ConfirmacionReservaDTO();
        confirmacion.setCodigoReserva(reserva.getCodigoReserva());
        confirmacion.setFechaReserva(reserva.getFecha());
        confirmacion.setTiquetes(tiquetes.stream()
            .map(t -> modelMapper.map(t, TiqueteDTO.class))
            .collect(Collectors.toList()));
        confirmacion.setPago(modelMapper.map(reserva.getPago(), com.api.backend.dto.PagoDTO.class));
        confirmacion.setValorTotal(BigDecimal.valueOf(reserva.getPago().getValorAPagar()));
        confirmacion.setMensajeConfirmacion("Reserva confirmada exitosamente. Los tiquetes han sido generados.");

        return confirmacion;
    }

    @Override
    public byte[] descargarTiquetePDF(Long idTiquete) {
        // En una implementación real, aquí se generaría el PDF
        // Por ahora, retornamos un array vacío
        return new byte[0];
    }

    @Override
    public String descargarTiqueteJSON(Long idTiquete) {
        Tiquete tiquete = tiqueteRepository.findById(idTiquete)
            .orElseThrow(() -> new RuntimeException("Tiquete no encontrado"));

        try {
            TiqueteDTO dto = modelMapper.map(tiquete, TiqueteDTO.class);
            return objectMapper.writeValueAsString(dto);
        } catch (Exception e) {
            throw new RuntimeException("Error al generar JSON del tiquete", e);
        }
    }

    @Override
    public String generarCodigoReservaUnico() {
        return "RSV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private Tiquete crearTiqueteParaPasajero(Pasajero pasajero, Reserva reserva) {
        Tiquete tiquete = new Tiquete();
        tiquete.setCodigoReserva(reserva.getCodigoReserva());
        tiquete.setVuelo(reserva.getPago().getReserva().getTiquetes().get(0).getVuelo()); // Simplificado
        tiquete.setAsientoVuelo(reserva.getPago().getReserva().getTiquetes().get(0).getAsientoVuelo()); // Simplificado
        tiquete.setPasajero(pasajero);
        tiquete.setPago(reserva.getPago());
        tiquete.setReserva(reserva);
        return tiquete;
    }
}