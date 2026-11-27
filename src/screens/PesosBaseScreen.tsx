import React from 'react';
import PesosForm from '../components/PesosForm';

export default function PesosBaseScreen() {
    return (
        <PesosForm
            title="BASE"
            endpoint="http://192.168.15.155:3002/api/evaporador/pesosBase"
            tiempoDisparo="6.00"
        />
    );
}
