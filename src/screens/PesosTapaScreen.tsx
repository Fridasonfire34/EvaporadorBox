import React from 'react';
import PesosForm from '../components/PesosForm';

export default function PesosTapaScreen() {
    return (
        <PesosForm
            title="TAPA"
            endpoint="http://192.168.15.155:3002/api/evaporador/pesosTapa"
            tiempoDisparo="7.60"
        />
    );
}
