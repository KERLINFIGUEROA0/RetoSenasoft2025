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
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
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
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
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
    public byte[] descargarTiquetePDF(Long idReserva) {
         com.api.backend.entity.Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Documento con márgenes amplios
            Document document = new Document(PageSize.A4, 50, 50, 60, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            // ----- ENCABEZADO -----
            Font tituloFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(40, 90, 200));
            Paragraph titulo = new Paragraph("RESUMEN DE LA RESERVA", tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);

            document.add(new Paragraph(" "));
            LineSeparator linea = new LineSeparator();
            linea.setLineColor(new Color(40, 90, 200));
            document.add(linea);
            document.add(new Paragraph(" "));

            // ----- DATOS DEL PASAJERO Y VUELO -----
            for (Pasajero pasajero : reserva.getPasajeros()) {
                Font seccionFont = new Font(Font.HELVETICA, 14, Font.BOLD, new Color(30, 30, 30));
                Font textoFont = new Font(Font.HELVETICA, 12, Font.NORMAL, Color.DARK_GRAY);

                Paragraph seccion1 = new Paragraph("Datos del pasajero", seccionFont);
                seccion1.setSpacingAfter(8);
                document.add(seccion1);

                PdfPTable tablaPasajero = new PdfPTable(2);
                tablaPasajero.setWidthPercentage(100);
                tablaPasajero.setSpacingAfter(15);

                addRow(tablaPasajero, "Nombre:", pasajero.getNombres(), textoFont);
                addRow(tablaPasajero, "Documento:", pasajero.getNumeroDocumento(), textoFont);
                addRow(tablaPasajero, "Correo:", pasajero.getEmail(), textoFont);
                document.add(tablaPasajero);

                Paragraph seccion2 = new Paragraph("Detalles del vuelo", seccionFont);
                seccion2.setSpacingAfter(8);
                document.add(seccion2);

                PdfPTable tablaVuelo = new PdfPTable(2);
                tablaVuelo.setWidthPercentage(100);
                tablaVuelo.setSpacingAfter(20);

                LocalDateTime fechaSalida = reserva.getTiquetes().getFirst().getVuelo().getFechaSalida();
                Locale localeColombia = new Locale("es", "CO");

                DateTimeFormatter formatterFecha = DateTimeFormatter.ofPattern("EEEE d 'de' MMMM 'de' yyyy", localeColombia);
                String fechaFormateada = fechaSalida.format(formatterFecha);

                DateTimeFormatter formatterHora = DateTimeFormatter.ofPattern("hh:mm a", localeColombia);
                String horaFormateada = fechaSalida.format(formatterHora);

                NumberFormat formatoMoneda = NumberFormat.getCurrencyInstance(localeColombia);
                String precioFormateado = formatoMoneda.format(reserva.getTiquetes().getFirst().getVuelo().getPrecio().longValue());

                addRow(tablaVuelo, "Vuelo:", reserva.getCodigoReserva(), textoFont);
                addRow(tablaVuelo, "Origen:", reserva.getTiquetes().getFirst().getVuelo().getOrigen().toString(), textoFont);
                addRow(tablaVuelo, "Destino:", reserva.getTiquetes().getFirst().getVuelo().getDestino().toString(), textoFont);
                addRow(tablaVuelo, "Fecha de salida:", fechaFormateada, textoFont);
                addRow(tablaVuelo, "Hora de salida:", horaFormateada, textoFont);
                addRow(tablaVuelo, "Asiento:", reserva.getTiquetes().getFirst().getAsientoVuelo().getAsiento().getNombre(), textoFont);
                addRow(tablaVuelo, "Precio:", precioFormateado, textoFont);
                document.add(tablaVuelo);
            }

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