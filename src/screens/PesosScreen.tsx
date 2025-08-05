import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ImageBackground,
    Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PesosScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { fecha, job } = route.params || {};

    const [data, setData] = useState({
        item: '',
        fecha: fecha || '',
        operador: '',
        ensamble: '',
        temperatura: '',
        pesoAntes: '',
        pesoDespues: '',
        maquinado: '',
        termometroId: '',
    });

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const onSave = () => {
        console.log('Guardando datos:', data);
        // Aquí podrías enviar a backend o navegar a otra pantalla.
    };

    return (
        <ImageBackground source={require('../assets/bg1-eb.jpg')} style={{ flex: 1 }}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Registro de Pesos y Espumado</Text>
            </View>

            {/* Job y Fecha */}
            <View style={styles.infoRow}>
                <Text style={styles.bold2}>FECHA: </Text>
                <Text style={styles.normal}>{fecha}      </Text>
                <Text style={styles.bold2}>JOB: </Text>
                <Text style={styles.normal}>{job}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Item - Fecha */}
                <View style={[styles.rowPair, { width: width * 0.9 }]}>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>Item:</Text>
                        <TextInput
                            style={styles.input}
                            value={data.item}
                            onChangeText={text => handleChange('item', text)}
                        />
                    </View>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>Fecha:</Text>
                        <TextInput
                            style={styles.input}
                            value={data.fecha}
                            onChangeText={text => handleChange('fecha', text)}
                        />
                    </View>
                </View>

                {/* Operador - Ensamble */}
                <View style={[styles.rowPair, { width: width * 0.9 }]}>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>Operador:</Text>
                        <TextInput
                            style={[styles.input, { width: 100 }]} // 👈 Aquí defines el ancho deseado
                            value={data.operador}
                            onChangeText={text => handleChange('operador', text)}
                        />
                    </View>
                    <View style={styles.pairItemASSY}>
                        <Text style={styles.label}>Ensamble: Tapa/Cuerpo/Base:</Text>
                        <TextInput
                            style={[styles.input, { width: 160 }]}
                            value={data.ensamble}
                            onChangeText={text => handleChange('ensamble', text)}
                        />
                    </View>
                </View>

                {/* Temperatura */}
                <Text style={styles.label}>Temperatura de Molde °F</Text>
                <Text style={styles.subLabel}>Tolerancia 105° - 125°:</Text>
                <TextInput
                    style={styles.input}
                    value={data.temperatura}
                    onChangeText={text => handleChange('temperatura', text)}
                    keyboardType="numeric"
                />

                {/* Pesos */}
                <Text style={styles.labelPesos}>Pesos (Libras):</Text>
                <View style={[styles.rowPair, { width: width * 0.9 }]}>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>Antes:</Text>
                        <TextInput
                            style={styles.input}
                            value={data.pesoAntes}
                            onChangeText={text => handleChange('pesoAntes', text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>Después:</Text>
                        <TextInput
                            style={styles.input}
                            value={data.pesoDespues}
                            onChangeText={text => handleChange('pesoDespues', text)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Maquinado - Termómetro */}
                <View style={[styles.rowPair, { width: width * 0.9 }]}>
                    <View style={styles.pairItemME}>
                        <Text style={styles.label}>Maquinado Espumado:</Text>
                        <TextInput
                            style={[styles.input, { width: 150 }]}
                            value={data.maquinado}
                            onChangeText={text => handleChange('maquinado', text)}
                        />
                    </View>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>ID Termómetro:</Text>
                        <TextInput
                            style={[styles.input, { width: 140 }]}
                            value={data.termometroId}
                            onChangeText={text => handleChange('termometroId', text)}
                        />
                    </View>
                </View>

                {/* Guardar */}
                <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 50,
        paddingHorizontal: 20,
    },
    headerBox: {
        backgroundColor: '#0011ff',
        padding: 15,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingVertical: 5,
    },
    normal: {
        fontSize: 14,
        color: 'white',
    },
    bold2: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    labelPesos: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 15,
        textAlign: 'center'
    },
    subLabel: {
        fontSize: 12,
        marginBottom: 4,
        fontStyle: 'italic',
        color: '#444',
    },
    rowPair: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    pairItem: {
        width: '40%',
    },
    pairItemASSY: {
        width: '65%',
    },
    pairItemME: {
        width: '60%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    inputOp: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#0011ff',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PesosScreen;
