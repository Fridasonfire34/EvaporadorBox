import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const MenuScreen = () => {
    const route = useRoute();
    const { job } = route.params || {};
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const navigation = useNavigation();


    const buttons = [
        { id: 0, label: 'Registro de lecturas', screen: 'RegistroLecturas' },
        { id: 1, label: 'Registro de Pesos', screen: 'Pesos' },
        { id: 2, label: 'Checklist Proceso', screen: 'ProcesoScreen' },
        { id: 3, label: 'Checklist Final', screen: 'FinalScreen' },
        { id: 4, label: 'Evidencias', screen: 'EvidenciaScreen' },
    ];

    const handlePress = (id: number, screen: string | null) => {
        setActiveButton(id);
        if (screen) {
            navigation.navigate(screen as never);
        }
    };

    return (
        <View style={styles.container}>

            {/* Job */}
            <View style={styles.infoRow}>
                <Text style={styles.bold2}>JOB: </Text>
                <Text style={styles.normal}>{job}</Text>
            </View>

            <View style={styles.buttonContainer}>
                {buttons.map((button) => {
                    const isActive = activeButton === button.id;
                    const hasRegistro = button.label.includes('Registro');
                    const hasCheckList = button.label.includes('Checklist');
                    const hasEvidencia = button.label.includes('Evidencias');

                    return (
                        <TouchableOpacity
                            key={button.id}
                            style={[styles.button, isActive && styles.activeButton]}
                            onPress={() => handlePress(button.id, button.screen)}
                        >
                            <View style={styles.contentRow}>
                                {hasRegistro && (
                                    <Image
                                        source={require('../assets/Registro.png')}
                                        style={styles.buttonImage}
                                    />
                                )}
                                {hasCheckList && (
                                    <Image
                                        source={require('../assets/checklist.png')}
                                        style={styles.buttonImageRegistro}
                                    />
                                )}
                                {hasEvidencia && (
                                    <Image
                                        source={require('../assets/camara.png')}
                                        style={styles.buttonImageCamera}
                                    />
                                )}
                                <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
                                    {button.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    header: {
        position: 'absolute',
        top: 10,
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 30
    },
    button: {
        backgroundColor: '#0000beff',
        paddingVertical: 10,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    activeButton: {
        backgroundColor: '#ffffff',
        borderColor: 'blue',
        borderWidth: 2,
    },
    activeButtonText: {
        color: '#000000',
    },
    buttonImage: {
        width: 80,
        height: 80,
        marginRight: 2,
        resizeMode: 'contain',
    },
    buttonImageRegistro: {
        width: 60,
        height: 60,
        marginRight: 2,
        resizeMode: 'contain',
    },
    buttonImageCamera: {
        width: 50,
        height: 50,
        marginRight: 2,
        resizeMode: 'contain',
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    RegisterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    normal: {
        fontSize: 24,
        color: 'black'
    },
    bold2: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'black'
    },
});

export default MenuScreen;
