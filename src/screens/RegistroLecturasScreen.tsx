import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ImageBackground, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modal, Pressable } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const RegistroLecturasScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { fecha, job } = route.params || {};
    const [data, setData] = useState({
        drainA: {
            ambiente: '',
            tc1: '',
            tc2: '',
            linea3: '',
        },
        drainB: {
            ambiente: '',
            tc1: '',
            tc2: '',
            linea3: '',
        },
    });

    const imageList = [
        { id: 1, src: require('../assets/multimetro.png') },
        { id: 2, src: require('../assets/Imagen1_REPLECT.png') },
        { id: 3, src: require('../assets/Imagen2_REPLECT.png') },
    ];

    const handleChange = (section, key, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    return (
        <ImageBackground source={require('../assets/bg1-eb.jpg')} style={{ flex: 1 }}>

            {/* Registro de Lecturas */}
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Registro de Lecturas</Text>
            </View>

            {/* DRAIN PAN */}
            <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>DRAIN PAN</Text>
            </View>

            {/* Instrucciones */}
            <View style={styles.sectionBox}>
                <View style={styles.instructionsWrapper}>
                    <Text style={styles.instructionText}>
                        <Text style={styles.bold}>Instrucciones: </Text>
                        Anote la temperatura ambiental antes de registrar las lecturas de los sensores. Luego, verifique y anote cada lectura, asegurándose de sean iguales o con tolerancia ±2 grados. Si hay diferencias entre los valores, repita la medición de dos a tres veces y, si la discrepancia persiste, informe al área de Calidad de Evaporador Box.
                    </Text>

                    <Text style={styles.instructionText}>
                        <Text style={styles.bold}>NOTA:
                            Si la lectura se encuentra fuera de tolerancia, segregar componente y notificar a supervisor. Utilizar equipo: I-CAL-011</Text>
                    </Text>
                </View>
            </View>
            {/* Job */}
            <View style={styles.infoRow}>
                <Text style={styles.bold2}>FECHA: </Text>
                <Text style={styles.normal}>{fecha}      </Text>
                <Text style={styles.bold2}>JOB: </Text>
                <Text style={styles.normal}>{job}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* DRAIN PAN A */}
                <Text style={styles.sectionTitle}>DRAIN PAN A:</Text>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Temperatura Ambiente (°C):</Text>
                    <TextInput
                        style={styles.inputSmall}
                        value={data.drainA.ambiente}
                        onChangeText={text => handleChange('drainA', 'ambiente', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.rowPair}>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>TC #1:</Text>
                        <TextInput
                            style={styles.inputSmall}
                            value={data.drainA.tc1}
                            onChangeText={text => handleChange('drainA', 'tc1', text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>TC #2:</Text>
                        <TextInput
                            style={styles.inputSmall}
                            value={data.drainA.tc2}
                            onChangeText={text => handleChange('drainA', 'tc2', text)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Línea #3:</Text>
                    <TextInput
                        style={styles.inputSmall}
                        value={data.drainA.linea3}
                        onChangeText={text => handleChange('drainA', 'linea3', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* DRAIN PAN B */}
                <Text style={styles.sectionTitle}>DRAIN PAN B:</Text>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Temperatura Ambiente (°C):</Text>
                    <TextInput
                        style={styles.inputSmall}
                        value={data.drainB.ambiente}
                        onChangeText={text => handleChange('drainB', 'ambiente', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.rowPair}>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>TC #1:</Text>
                        <TextInput
                            style={styles.inputSmall}
                            value={data.drainB.tc1}
                            onChangeText={text => handleChange('drainB', 'tc1', text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.pairItem}>
                        <Text style={styles.label}>TC #2:</Text>
                        <TextInput
                            style={styles.inputSmall}
                            value={data.drainB.tc2}
                            onChangeText={text => handleChange('drainB', 'tc2', text)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Línea #3 */}
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Línea #3:</Text>
                    <TextInput
                        style={styles.inputSmall}
                        value={data.drainB.linea3}
                        onChangeText={text => handleChange('drainB', 'linea3', text)}
                        keyboardType="numeric"
                    />
                </View>
                {/* Botón Guardar */}
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>GUARDAR</Text>
                </TouchableOpacity>
                {/* Imágenes (3) debajo de Línea #3 */}
                <View style={styles.imageRow}>
                    {imageList.map((img) => (
                        <Pressable
                            key={img.id}
                            onPress={() => {
                                setSelectedImageId(img.id);
                                setModalVisible(true);
                            }}
                        >
                            <Image source={img.src} style={styles.image} resizeMode="cover" />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {selectedImageId !== null && (
                        <View style={styles.modalContent}>
                            <Image
                                source={imageList.find(img => img.id === selectedImageId).src}
                                style={styles.fullImage}
                                resizeMode="contain"
                                enableSwipeDown
                                renderIndicator={() => null}
                            />
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>CERRAR</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 50,
    },
    container: {
        flexGrow: 1,
        paddingBottom: 50,
    },
    headerBox: {
        backgroundColor: '#0011ffff',
        padding: 15,
        marginBottom: 1,
        alignItems: 'center'
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    sectionBox: {
        marginBottom: 10,
        alignItems: 'center',
        marginLeft: 1
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginLeft: 1,
        textAlign: 'center'
    },
    instructionText: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'justify'
    },
    bold: {
        fontWeight: 'bold',
    },
    instructionsWrapper: {
        marginLeft: 5,
        marginRight: 5,
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000ff',
    },
    RegisterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    normal: {
        fontSize: 14,
        color: 'white'
    },
    bold2: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginLeft: 5
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 8,
    },
    rowPair: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 0,
    },
    pairItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.48,
        marginLeft: 5
    },
    inputSmall: {
        borderWidth: 1,
        borderColor: '#4e4e4e73',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
        width: 90,
        height: 35,
        backgroundColor: '#c2c2c2ff',
    },
    saveButton: {
        backgroundColor: '#0011ff',
        padding: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        borderRadius: 12,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#999',
        backgroundColor: '#ffffffff',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ff0000cc',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        elevation: 3,
    },

    closeButtonText: {
        color: '#ffffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },


});

export default RegistroLecturasScreen;
