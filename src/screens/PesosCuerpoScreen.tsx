import React from 'react';
import PesosForm from '../components/PesosForm';

export default function PesosCuerpoScreen() {
    return (
        <PesosForm
            title="CUERPO"
            endpoint="http://192.168.15.155:3002/api/evaporador/pesosCuerpo"
            tiempoDisparo="18.00"
        />
    );
}
