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
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.io.ByteArrayOutputStream;
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
        Tiquete tiquete = tiqueteRepository.findById(idTiquete)
                .orElseThrow(() -> new RuntimeException("Tiquete no encontrado"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Documento con márgenes amplios
            Document document = new Document(PageSize.A4, 50, 50, 60, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            // ----- ENCABEZADO -----
            Font tituloFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(40, 90, 200));
            Paragraph titulo = new Paragraph("TIQUETE AÉREO DIGITAL", tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);

            document.add(new Paragraph(" "));
            LineSeparator linea = new LineSeparator();
            linea.setLineColor(new Color(40, 90, 200));
            document.add(linea);
            document.add(new Paragraph(" "));

            // ----- DATOS DEL PASAJERO Y VUELO -----
            Font seccionFont = new Font(Font.HELVETICA, 14, Font.BOLD, new Color(30, 30, 30));
            Font textoFont = new Font(Font.HELVETICA, 12, Font.NORMAL, Color.DARK_GRAY);

            Paragraph seccion1 = new Paragraph("Datos del pasajero", seccionFont);
            seccion1.setSpacingAfter(8);
            document.add(seccion1);

            PdfPTable tablaPasajero = new PdfPTable(2);
            tablaPasajero.setWidthPercentage(100);
            tablaPasajero.setSpacingAfter(15);

            addRow(tablaPasajero, "Nombre:", tiquete.getPasajero().getNombres(), textoFont);
            addRow(tablaPasajero, "Documento:", tiquete.getPasajero().getNumeroDocumento(), textoFont);
            addRow(tablaPasajero, "Correo:", tiquete.getPasajero().getEmail(), textoFont);
            document.add(tablaPasajero);

            Paragraph seccion2 = new Paragraph("Detalles del vuelo", seccionFont);
            seccion2.setSpacingAfter(8);
            document.add(seccion2);

            PdfPTable tablaVuelo = new PdfPTable(2);
            tablaVuelo.setWidthPercentage(100);
            tablaVuelo.setSpacingAfter(20);

            addRow(tablaVuelo, "Vuelo:", tiquete.getCodigoReserva(), textoFont);
            addRow(tablaVuelo, "Origen:", tiquete.getVuelo().getOrigen().toString(), textoFont);
            addRow(tablaVuelo, "Destino:", tiquete.getVuelo().getDestino().toString(), textoFont);
            addRow(tablaVuelo, "Fecha de salida:", tiquete.getVuelo().getFechaSalida().toString(), textoFont);
            addRow(tablaVuelo, "Asiento:", tiquete.getAsientoVuelo().getAsiento().getNombre(), textoFont);
            addRow(tablaVuelo, "Precio:", "$" + tiquete.getVuelo().getPrecio(), textoFont);
            document.add(tablaVuelo);

            // ----- PIE DE PÁGINA -----
            document.add(new Paragraph(" "));
            LineSeparator lineaFinal = new LineSeparator();
            lineaFinal.setLineColor(Color.LIGHT_GRAY);
            document.add(lineaFinal);

            Paragraph agradecimiento = new Paragraph(
                    "Gracias por viajar con nosotros \nAerolínea AirFly 2025",
                    new Font(Font.HELVETICA, 12, Font.ITALIC, new Color(80, 80, 80))
            );
            agradecimiento.setAlignment(Element.ALIGN_CENTER);
            agradecimiento.setSpacingBefore(10);
            document.add(agradecimiento);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando el PDF: " + e.getMessage(), e);
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, new Font(Font.HELVETICA, 12, Font.BOLD)));
        PdfPCell c2 = new PdfPCell(new Phrase(value != null ? value : "-", font));

        c1.setBackgroundColor(new Color(240, 240, 255));
        c1.setBorderColor(Color.WHITE);
        c2.setBorderColor(Color.WHITE);

        table.addCell(c1);
        table.addCell(c2);
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