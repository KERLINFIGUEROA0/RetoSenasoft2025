package com.api.backend.controller;

import com.api.backend.dto.ReservaRequest;
import com.api.backend.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    ReservaService reservaService;

    @PostMapping("/")
    public ResponseEntity<?> crearReserva(ReservaRequest reservaRequest){
        return ResponseEntity.ok(reservaService.crearReserva(reservaRequest));
    }
}
