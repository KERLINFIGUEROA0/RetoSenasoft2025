package com.api.backend.repository;

import com.api.backend.entity.AsientoVuelo;
import com.api.backend.entity.Vuelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsientoVueloRepository extends JpaRepository<AsientoVuelo, Long> {
    List<AsientoVuelo> findByVueloAndDisponibleTrue(Vuelo vuelo);
    long countByVueloAndDisponible(Vuelo vuelo, boolean disponible);
    List<AsientoVuelo> findByVuelo(Vuelo vuelo);
}