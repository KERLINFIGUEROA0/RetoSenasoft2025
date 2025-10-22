package com.api.backend.implement;

import com.api.backend.dto.PagoDTO;
import com.api.backend.dto.SimulacionPagoRequest;
import com.api.backend.dto.SimulacionPagoResponse;
import com.api.backend.entity.Pago;
import com.api.backend.entity.Reserva;
import com.api.backend.entity.Vuelo;
import com.api.backend.repository.PagoRepository;
import com.api.backend.repository.ReservaRepository;
import com.api.backend.service.PagoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class PagoImplement implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public SimulacionPagoResponse simularPago(SimulacionPagoRequest request) {
        SimulacionPagoResponse response = new SimulacionPagoResponse();

        // Validar términos y condiciones
        if (!validarTerminos(request)) {
            response.setExitoso(false);
            response.setMensaje("Debe aceptar los términos y condiciones");
            return response;
        }

        // Validar datos del pagador
        if (!validarDatosPagador(request)) {
            response.setExitoso(false);
            response.setMensaje("Datos del pagador incompletos o inválidos");
            return response;
        }

        // Obtener la reserva
        Reserva reserva = reservaRepository.findById(request.getIdReserva())
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Long valorTotal = calcularValorTotal(reserva);


        // Crear entidad de pago
        Pago pago = new Pago();
        pago.setFecha(LocalDateTime.now());
        pago.setValorAPagar(valorTotal);
        pago.setMetodoPago(request.getMetodoPago());
        pago.setEstadoPago("APROBADO");
        pago.setNombrePagador(request.getNombrePagador());
        pago.setTipoDocumentoPagador(request.getTipoDocumentoPagador());
        pago.setNumeroDocumentoPagador(request.getNumeroDocumentoPagador());
        pago.setCorreoPagador(request.getCorreoPagador());
        pago.setTelefonoPagador(request.getTelefonoPagador());
        pago.setReserva(reserva);

        Pago pagoGuardado = pagoRepository.save(pago);


        response.setCodigoTransaccion(UUID.randomUUID().toString());
        response.setPago(modelMapper.map(pagoGuardado, PagoDTO.class));

        return response;
    }

    @Override
    public boolean validarDatosPagador(SimulacionPagoRequest request) {
        return request.getNombrePagador() != null && !request.getNombrePagador().trim().isEmpty() &&
               request.getTipoDocumentoPagador() != null && !request.getTipoDocumentoPagador().trim().isEmpty() &&
               request.getNumeroDocumentoPagador() != null && !request.getNumeroDocumentoPagador().trim().isEmpty() &&
               request.getCorreoPagador() != null && !request.getCorreoPagador().trim().isEmpty() &&
               request.getTelefonoPagador() != null && !request.getTelefonoPagador().trim().isEmpty();
    }

    @Override
    public boolean validarTerminos(SimulacionPagoRequest request) {
        return request.isTerminosAceptados();
    }


    private Long calcularValorTotal(Reserva reserva) {
        Vuelo vuelo = reserva.getTiquetes().getFirst().getVuelo();
        int numeroPasajeros = reserva.getPasajeros().size();
        BigDecimal totalAPagar = vuelo.getPrecio().multiply(BigDecimal.valueOf(numeroPasajeros));

        return totalAPagar.longValue();
    }
}