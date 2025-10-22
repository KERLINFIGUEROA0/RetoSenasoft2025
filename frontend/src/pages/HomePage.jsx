import { useState } from 'react';
import Header from '../layout/Header/Header';
import SearchForm from '../features/flight-search/components/SearchForm/SearchForm';
import FlightResults from '../features/flight-search/components/FlightResults/FlightResults';
import { useFlightSearch } from '../features/flight-search/hooks/useFlightSearch';

function HomePage() {
  const { vuelos, buscando, error, buscarVuelos } = useFlightSearch();

  const handleFlightSelect = (vuelo) => {
    console.log('Vuelo seleccionado:', vuelo);
    // Aquí iría la navegación a la página de selección de asientos
    alert(`Vuelo seleccionado: ${vuelo.origen?.codigo} → ${vuelo.destino?.codigo}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchForm onSearch={buscarVuelos} loading={buscando} />

        <FlightResults
          vuelos={vuelos}
          loading={buscando}
          error={error}
          onSelectFlight={handleFlightSelect}
        />
      </main>
    </div>
  );
}

export default HomePage;