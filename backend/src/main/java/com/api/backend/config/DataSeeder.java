package com.api.backend.config;

import com.api.backend.entity.*;
import com.api.backend.config.enums.CiudadesEnum;
import com.api.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AvionRepository avionRepository;
    private final AsientoRepository asientoRepository;
    private final VueloRepository vueloRepository;
    private final AsientoVueloRepository asientoVueloRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReservaRepository reservaRepository;
    private final PasajeroRepository pasajeroRepository;
    private final PagoRepository pagoRepository;
    private final TiqueteRepository tiqueteRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (avionRepository.count() == 0) {
            log.info("🌱 Iniciando seeder de datos...");

            // 1. Crear usuarios
            List<Usuario> usuarios = crearUsuarios();
            log.info("✅ Usuarios creados: {}", usuarios.size());

            // 2. Crear aviones
            List<Avion> aviones = crearAviones();
            log.info("✅ Aviones creados: {}", aviones.size());

            // 3. Crear asientos para cada avión
            crearAsientos(aviones);
            log.info("✅ Asientos creados para todos los aviones");

            // 4. Crear vuelos
            List<Vuelo> vuelos = crearVuelos(aviones);
            log.info("✅ Vuelos creados: {}", vuelos.size());

            // 5. Crear asientos_vuelo (disponibilidad de asientos por vuelo)
            crearAsientosVuelo(vuelos);
            log.info("✅ AsientosVuelo creados para todos los vuelos");

            // 6. Crear algunas reservas de ejemplo con todo el flujo completo
            crearReservasCompletas(usuarios, vuelos);
            log.info("✅ Reservas completas creadas");

            log.info("🎉 Seeder completado exitosamente!");
        } else {
            log.info("⏭️  Base de datos ya contiene datos, saltando seeder");
        }
    }

    private List<Usuario> crearUsuarios() {
        List<Usuario> usuarios = new ArrayList<>();

        Usuario usuario1 = new Usuario();
        usuario1.setNombres("Juan Carlos");
        usuario1.setPrimerApellido("Rodríguez");
        usuario1.setSegundoApellido("Pérez");
        usuario1.setEmail("juan.rodriguez@email.com");
        usuario1.setTelefono("3001234567");
        usuario1.setTipoDocumento("CC");
        usuario1.setNumeroDocumento("1234567890");
        usuario1.setPassword("password123");
        usuarios.add(usuarioRepository.save(usuario1));

        Usuario usuario2 = new Usuario();
        usuario2.setNombres("María Fernanda");
        usuario2.setPrimerApellido("García");
        usuario2.setSegundoApellido("López");
        usuario2.setEmail("maria.garcia@email.com");
        usuario2.setTelefono("3109876543");
        usuario2.setTipoDocumento("CC");
        usuario2.setNumeroDocumento("9876543210");
        usuario2.setPassword("password123");
        usuarios.add(usuarioRepository.save(usuario2));

        Usuario usuario3 = new Usuario();
        usuario3.setNombres("Carlos Alberto");
        usuario3.setPrimerApellido("Martínez");
        usuario3.setSegundoApellido("Sánchez");
        usuario3.setEmail("carlos.martinez@email.com");
        usuario3.setTelefono("3201112233");
        usuario3.setTipoDocumento("CC");
        usuario3.setNumeroDocumento("1122334455");
        usuario3.setPassword("password123");
        usuarios.add(usuarioRepository.save(usuario3));

        return usuarios;
    }

    private List<Avion> crearAviones() {
        List<Avion> aviones = new ArrayList<>();

        Avion avion1 = new Avion();
        avion1.setModelo("Boeing 737-800");
        avion1.setCapacidad(189);
        aviones.add(avionRepository.save(avion1));

        Avion avion2 = new Avion();
        avion2.setModelo("Airbus A320");
        avion2.setCapacidad(180);
        aviones.add(avionRepository.save(avion2));

        Avion avion3 = new Avion();
        avion3.setModelo("Boeing 787 Dreamliner");
        avion3.setCapacidad(242);
        aviones.add(avionRepository.save(avion3));

        Avion avion4 = new Avion();
        avion4.setModelo("Airbus A319");
        avion4.setCapacidad(144);
        aviones.add(avionRepository.save(avion4));

        return aviones;
    }

    private void crearAsientos(List<Avion> aviones) {
        for (Avion avion : aviones) {
            int filas = avion.getCapacidad() / 6; // 6 asientos por fila (A-F)
            String[] letras = {"A", "B", "C", "D", "E", "F"};

            for (int fila = 1; fila <= filas; fila++) {
                for (String letra : letras) {
                    Asiento asiento = new Asiento();
                    asiento.setNombre(fila + letra);
                    asiento.setDisponible(true);
                    asiento.setAvion(avion);
                    asientoRepository.save(asiento);
                }
            }
        }
    }

    private List<Vuelo> crearVuelos(List<Avion> aviones) {
        List<Vuelo> vuelos = new ArrayList<>();
        LocalDateTime ahora = LocalDateTime.now();

        // Vuelos desde Bogotá
        vuelos.add(crearVuelo(CiudadesEnum.BOGOTA, CiudadesEnum.MEDELLIN,
                ahora.plusDays(5).withHour(6).withMinute(0),
                ahora.plusDays(5).withHour(7).withMinute(15),
                new BigDecimal("180000"), aviones.get(0)));

        vuelos.add(crearVuelo(CiudadesEnum.BOGOTA, CiudadesEnum.CALI,
                ahora.plusDays(5).withHour(8).withMinute(30),
                ahora.plusDays(5).withHour(9).withMinute(30),
                new BigDecimal("165000"), aviones.get(1)));

        vuelos.add(crearVuelo(CiudadesEnum.BOGOTA, CiudadesEnum.CARTAGENA,
                ahora.plusDays(6).withHour(10).withMinute(0),
                ahora.plusDays(6).withHour(11).withMinute(45),
                new BigDecimal("250000"), aviones.get(2)));

        vuelos.add(crearVuelo(CiudadesEnum.BOGOTA, CiudadesEnum.BARRANQUILLA,
                ahora.plusDays(6).withHour(14).withMinute(0),
                ahora.plusDays(6).withHour(15).withMinute(50),
                new BigDecimal("235000"), aviones.get(3)));

        // Vuelos desde Medellín
        vuelos.add(crearVuelo(CiudadesEnum.MEDELLIN, CiudadesEnum.BOGOTA,
                ahora.plusDays(7).withHour(9).withMinute(0),
                ahora.plusDays(7).withHour(10).withMinute(15),
                new BigDecimal("180000"), aviones.get(0)));

        vuelos.add(crearVuelo(CiudadesEnum.MEDELLIN, CiudadesEnum.CARTAGENA,
                ahora.plusDays(7).withHour(11).withMinute(30),
                ahora.plusDays(7).withHour(12).withMinute(45),
                new BigDecimal("220000"), aviones.get(1)));

        vuelos.add(crearVuelo(CiudadesEnum.MEDELLIN, CiudadesEnum.CALI,
                ahora.plusDays(8).withHour(15).withMinute(0),
                ahora.plusDays(8).withHour(16).withMinute(0),
                new BigDecimal("195000"), aviones.get(2)));

        // Vuelos desde Cali
        vuelos.add(crearVuelo(CiudadesEnum.CALI, CiudadesEnum.BOGOTA,
                ahora.plusDays(8).withHour(7).withMinute(0),
                ahora.plusDays(8).withHour(8).withMinute(0),
                new BigDecimal("165000"), aviones.get(3)));

        vuelos.add(crearVuelo(CiudadesEnum.CALI, CiudadesEnum.CARTAGENA,
                ahora.plusDays(9).withHour(13).withMinute(30),
                ahora.plusDays(9).withHour(15).withMinute(0),
                new BigDecimal("245000"), aviones.get(0)));

        // Vuelos desde Cartagena
        vuelos.add(crearVuelo(CiudadesEnum.CARTAGENA, CiudadesEnum.BOGOTA,
                ahora.plusDays(9).withHour(16).withMinute(0),
                ahora.plusDays(9).withHour(17).withMinute(45),
                new BigDecimal("250000"), aviones.get(1)));

        vuelos.add(crearVuelo(CiudadesEnum.CARTAGENA, CiudadesEnum.MEDELLIN,
                ahora.plusDays(10).withHour(8).withMinute(0),
                ahora.plusDays(10).withHour(9).withMinute(15),
                new BigDecimal("220000"), aviones.get(2)));

        // Vuelos desde Barranquilla
        vuelos.add(crearVuelo(CiudadesEnum.BARRANQUILLA, CiudadesEnum.BOGOTA,
                ahora.plusDays(10).withHour(12).withMinute(0),
                ahora.plusDays(10).withHour(13).withMinute(50),
                new BigDecimal("235000"), aviones.get(3)));

        vuelos.add(crearVuelo(CiudadesEnum.BARRANQUILLA, CiudadesEnum.MEDELLIN,
                ahora.plusDays(11).withHour(14).withMinute(30),
                ahora.plusDays(11).withHour(15).withMinute(45),
                new BigDecimal("210000"), aviones.get(0)));

        // Vuelos adicionales para más opciones
        vuelos.add(crearVuelo(CiudadesEnum.BOGOTA, CiudadesEnum.MEDELLIN,
                ahora.plusDays(5).withHour(18).withMinute(0),
                ahora.plusDays(5).withHour(19).withMinute(15),
                new BigDecimal("195000"), aviones.get(1)));

        vuelos.add(crearVuelo(CiudadesEnum.BOGOTA, CiudadesEnum.CALI,
                ahora.plusDays(6).withHour(19).withMinute(30),
                ahora.plusDays(6).withHour(20).withMinute(30),
                new BigDecimal("175000"), aviones.get(2)));

        return vuelos;
    }

    private Vuelo crearVuelo(CiudadesEnum origen, CiudadesEnum destino,
                             LocalDateTime salida, LocalDateTime llegada,
                             BigDecimal precio, Avion avion) {
        Vuelo vuelo = new Vuelo();
        vuelo.setOrigen(origen);
        vuelo.setDestino(destino);
        vuelo.setFechaSalida(salida);
        vuelo.setFechaLlegada(llegada);
        vuelo.setPrecio(precio);
        vuelo.setAvion(avion);
        return vueloRepository.save(vuelo);
    }

    private void crearAsientosVuelo(List<Vuelo> vuelos) {
        for (Vuelo vuelo : vuelos) {
            List<Asiento> asientos = asientoRepository.findByAvion(vuelo.getAvion());

            for (Asiento asiento : asientos) {
                AsientoVuelo asientoVuelo = new AsientoVuelo();
                asientoVuelo.setVuelo(vuelo);
                asientoVuelo.setAsiento(asiento);
                asientoVuelo.setDisponible(true);
                asientoVueloRepository.save(asientoVuelo);
            }
        }
    }

    private void crearReservasCompletas(List<Usuario> usuarios, List<Vuelo> vuelos) {
        // Reserva 1: Usuario 1 - 2 pasajeros en vuelo Bogotá -> Medellín
        crearReservaCompleta(usuarios.get(0), vuelos.get(0), 2, false);

        // Reserva 2: Usuario 2 - 3 pasajeros (1 infante) en vuelo Bogotá -> Cartagena
        crearReservaCompleta(usuarios.get(1), vuelos.get(2), 3, true);

        // Reserva 3: Usuario 3 - 1 pasajero en vuelo Medellín -> Bogotá
        crearReservaCompleta(usuarios.get(2), vuelos.get(4), 1, false);
    }

    private void crearReservaCompleta(Usuario usuario, Vuelo vuelo, int numPasajeros, boolean conInfante) {
        // 1. Crear el pago principal para la reserva
        Pago pagoPrincipal = new Pago();
        pagoPrincipal.setFecha(LocalDateTime.now());
        pagoPrincipal.setValorAPagar(vuelo.getPrecio().longValue() * numPasajeros);
        pagoPrincipal.setMetodoPago("TARJETA_CREDITO");
        pagoPrincipal.setEstadoPago("APROBADO");
        pagoPrincipal.setNombrePagador(usuario.getNombres() + " " + usuario.getPrimerApellido());
        pagoPrincipal.setTipoDocumentoPagador(usuario.getTipoDocumento());
        pagoPrincipal.setNumeroDocumentoPagador(usuario.getNumeroDocumento());
        pagoPrincipal.setCorreoPagador(usuario.getEmail());
        pagoPrincipal.setTelefonoPagador(usuario.getTelefono());
        pagoPrincipal.setUsuario(usuario);
        pagoPrincipal = pagoRepository.save(pagoPrincipal);

        // 2. Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setFecha(LocalDateTime.now());
        reserva.setPago(pagoPrincipal);
        reserva.setCodigoReserva(generarCodigoReserva());
        reserva = reservaRepository.save(reserva);

        // 3. Crear los pasajeros
        List<Pasajero> pasajeros = new ArrayList<>();
        for (int i = 0; i < numPasajeros; i++) {
            Pasajero pasajero = new Pasajero();
            pasajero.setPrimerApellido("Apellido" + (i + 1));
            pasajero.setSegundoApellido("Segundo" + (i + 1));
            pasajero.setNombres("Pasajero " + (i + 1));
            pasajero.setEmail("pasajero" + (i + 1) + "@email.com");
            pasajero.setFechaNacimiento(LocalDate.now().minusYears(25 + i));
            pasajero.setGenero(i % 2 == 0 ? "M" : "F");
            pasajero.setTipoDocumento("CC");
            pasajero.setNumeroDocumento("100000000" + i);
            pasajero.setTelefono("300000000" + i);
            pasajero.setInfante(conInfante && i == numPasajeros - 1);
            pasajero.setReserva(reserva);
            pasajeros.add(pasajeroRepository.save(pasajero));
        }

        // 4. Obtener asientos disponibles y crear tiquetes
        List<AsientoVuelo> asientosDisponibles = asientoVueloRepository
                .findByVueloAndDisponibleTrue(vuelo);

        for (int i = 0; i < numPasajeros && i < asientosDisponibles.size(); i++) {
            // Crear un pago individual para cada tiquete (requerido por @OneToOne)
            Pago pagoTiquete = new Pago();
            pagoTiquete.setFecha(LocalDateTime.now());
            pagoTiquete.setValorAPagar(vuelo.getPrecio().longValue());
            pagoTiquete.setMetodoPago("TARJETA_CREDITO");
            pagoTiquete.setEstadoPago("APROBADO");
            pagoTiquete.setNombrePagador(usuario.getNombres() + " " + usuario.getPrimerApellido());
            pagoTiquete.setTipoDocumentoPagador(usuario.getTipoDocumento());
            pagoTiquete.setNumeroDocumentoPagador(usuario.getNumeroDocumento());
            pagoTiquete.setCorreoPagador(usuario.getEmail());
            pagoTiquete.setTelefonoPagador(usuario.getTelefono());
            pagoTiquete.setUsuario(usuario);
            pagoTiquete = pagoRepository.save(pagoTiquete);

            // Marcar asiento como no disponible
            AsientoVuelo asientoVuelo = asientosDisponibles.get(i);
            asientoVuelo.setDisponible(false);
            asientoVueloRepository.save(asientoVuelo);

            // Crear el tiquete
            Tiquete tiquete = new Tiquete();
            tiquete.setCodigoReserva(reserva.getCodigoReserva());
            tiquete.setVuelo(vuelo);
            tiquete.setAsientoVuelo(asientoVuelo);
            tiquete.setPasajero(pasajeros.get(i));
            tiquete.setPago(pagoTiquete);
            tiquete.setReserva(reserva);
            tiqueteRepository.save(tiquete);
        }
    }

    private String generarCodigoReserva() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder codigo = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = (int) (Math.random() * caracteres.length());
            codigo.append(caracteres.charAt(index));
        }
        return codigo.toString();
    }
}