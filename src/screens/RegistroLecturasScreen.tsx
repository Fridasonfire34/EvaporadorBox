import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistComments, ChecklistHeader, checklistStyles } from '../components/ChecklistUI';

type Readings = {
    ambiente: string;
    tc1: string;
    tc2: string;
    linea3: string;
};

type ReadingsNavigation = {
    RegistroLecturas: { job: string | number };
    Menu: { job: string | number };
};

const imageList = [
    { id: 1, src: require('../assets/multimetro.png') },
    { id: 2, src: require('../assets/Imagen1_REPLECT.png') },
    { id: 3, src: require('../assets/Imagen2_REPLECT.png') },
];

const RegistroLecturasScreen = () => {
    const navigation = useNavigation<NavigationProp<ReadingsNavigation>>();
    const route = useRoute<RouteProp<ReadingsNavigation, 'RegistroLecturas'>>();
    const { job } = route.params;
    const [user, setUser] = useState<{ Nomina: string } | null>(null);
    const [approvalStatus, setApprovalStatus] = useState<'approved' | 'notApproved' | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comentarios, setComentarios] = useState('');
    const fechaISO = new Date().toISOString();
    const formatFechaLocal = (fecha: string) => {
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const [data, setData] = useState<Record<'drainA' | 'drainB', Readings>>({
        drainA: { ambiente: '', tc1: '', tc2: '', linea3: '' },
        drainB: { ambiente: '', tc1: '', tc2: '', linea3: '' },
    });

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };
        loadUserData();
    }, []);

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
            </View>
        );
    }

    const handleChange = (section: 'drainA' | 'drainB', key: keyof Readings, value: string) => {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: value },
        }));
    };

    const handleSave = async () => {
        const payload = {
            job,
            fecha: fechaISO,
            nomina: user.Nomina,
            drainA: data.drainA,
            drainB: data.drainB,
            comentarios,
            aprobado: approvalStatus === 'approved' ? 'SI' : 'NO',
        };

        try {
            const response = await fetch('http://192.168.15.155:3002/api/evaporador/registroLecturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            console.log('Response:', response);
            const result = await response.json();

            if (result.success) {
                Alert.alert('Lectura registrada correctamente');
                try {
                    await fetch('http://192.168.15.155:3002/api/evaporador/completeJobs', {
                        method: 'POST',
                    });
                } catch (error) {
                    console.error('Error al llamar a completeJobs:', error);
                }
                navigation.navigate('Menu', { job });
            } else {
                Alert.alert('Error al registrar lectura');
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            Alert.alert('Error de conexión al servidor');
        }
    };

    const selectedImage = imageList.find(img => img.id === selectedImageId);

    return (
        <View style={checklistStyles.background}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
            >
                <ScrollView contentContainerStyle={checklistStyles.scrollContent} keyboardShouldPersistTaps="handled">
                    <ChecklistHeader
                        label="DRAIN PAN"
                        title="Registro de Lecturas"
                        date={formatFechaLocal(fechaISO)}
                        job={job}
                        nomina={user.Nomina}
                        instructions="Anote la temperatura ambiental antes de registrar las lecturas de los sensores. Luego, verifique y anote cada lectura, asegurándose de sean iguales o con tolerancia ±2 grados. Si hay diferencias entre los valores, repita la medición de dos a tres veces y, si la discrepancia persiste, informe al área de Calidad de Evaporador Box."
                    />
                    <View style={styles.note}>
                        <Text style={styles.noteText}>
                            NOTA: Si la lectura se encuentra fuera de tolerancia, segregar componente y notificar a supervisor. Utilizar equipo: I-CAL-011
                        </Text>
                    </View>

                    {(['drainA', 'drainB'] as const).map(section => {
                        const name = section === 'drainA' ? 'A' : 'B';
                        return (
                            <View style={styles.card} key={section}>
                                <Text style={styles.cardTitle}>DRAIN PAN {name}</Text>
                                <Text style={styles.label}>Temperatura ambiente (°C)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={data[section].ambiente}
                                    onChangeText={text => handleChange(section, 'ambiente', text)}
                                    keyboardType="numeric"
                                    accessibilityLabel={`Drain pan ${name}, temperatura ambiente`}
                                />
                                <View style={styles.row}>
                                    {(['tc1', 'tc2'] as const).map((field, index) => (
                                        <View style={styles.halfField} key={field}>
                                            <Text style={styles.label}>TC #{index + 1}</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={data[section][field]}
                                                onChangeText={text => handleChange(section, field, text)}
                                                keyboardType="numeric"
                                                accessibilityLabel={`Drain pan ${name}, TC ${index + 1}`}
                                            />
                                        </View>
                                    ))}
                                </View>
                                <Text style={styles.label}>Línea #3</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={data[section].linea3}
                                        onValueChange={value => handleChange(section, 'linea3', value)}
                                        accessibilityLabel={`Drain pan ${name}, línea 3`}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Seleccione..." value={section === 'drainA' ? 'Selec...' : ''} />
                                        <Picker.Item label="Sí" value="sí" />
                                        <Picker.Item label="No" value="no" />
                                    </Picker>
                                </View>
                            </View>
                        );
                    })}

                    <ChecklistComments value={comentarios} onChange={setComentarios} />
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Resultado</Text>
                        <View style={styles.approvalRow}>
                            <TouchableOpacity
                                style={[styles.approvalButton, approvalStatus === 'approved' && styles.approved]}
                                onPress={() => setApprovalStatus('approved')}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: approvalStatus === 'approved' }}
                            >
                                <Text style={[styles.approvalText, approvalStatus === 'approved' && styles.approvalTextSelected]}>
                                    APROBADO
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.approvalButton, approvalStatus === 'notApproved' && styles.notApproved]}
                                onPress={() => setApprovalStatus('notApproved')}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: approvalStatus === 'notApproved' }}
                            >
                                <Text style={[styles.approvalText, approvalStatus === 'notApproved' && styles.approvalTextSelected]}>
                                    NO APROBADO
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>GUARDAR</Text>
                    </TouchableOpacity>

                    <Text style={checklistStyles.sectionHeading}>Imágenes de referencia</Text>
                    <View style={styles.imageRow}>
                        {imageList.map(img => (
                            <Pressable
                                key={img.id}
                                onPress={() => {
                                    setSelectedImageId(img.id);
                                    setModalVisible(true);
                                }}
                                accessibilityRole="button"
                                accessibilityLabel={`Abrir imagen de referencia ${img.id}`}
                            >
                                <Image source={img.src} style={styles.image} resizeMode="cover" />
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        {selectedImage && (
                            <View style={styles.modalContent}>
                                <Image source={selectedImage.src} style={styles.fullImage} resizeMode="contain" />
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>CERRAR</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, backgroundColor: '#f4f6fb' },
    loadingText: { fontSize: 14, textAlign: 'center', marginTop: 80 },
    keyboardContainer: { flex: 1 },
    note: {
        backgroundColor: '#fff7e6',
        borderColor: '#f3d9a6',
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 14,
    },
    noteText: { color: '#765116', fontSize: 14, lineHeight: 20 },
    card: {
        backgroundColor: '#fff',
        borderColor: '#e5e9f2',
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 14,
    },
    cardTitle: { color: '#0b2d6b', fontSize: 17, fontWeight: '700', marginBottom: 8 },
    label: { color: '#1a1a2e', fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 6 },
    row: { flexDirection: 'row', gap: 12 },
    halfField: { flex: 1 },
    input: {
        backgroundColor: '#f8f9fc',
        borderColor: '#dbe3ef',
        borderWidth: 1,
        borderRadius: 10,
        color: '#1a1a2e',
        minHeight: 48,
        paddingHorizontal: 12,
    },
    pickerContainer: { borderWidth: 1, borderColor: '#dbe3ef', borderRadius: 10, backgroundColor: '#f8f9fc' },
    picker: { color: '#1a1a2e' },
    approvalRow: { flexDirection: 'row', gap: 10 },
    approvalButton: {
        flex: 1,
        minHeight: 48,
        borderWidth: 1,
        borderColor: '#dbe3ef',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    approved: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
    notApproved: { backgroundColor: '#c0392b', borderColor: '#c0392b' },
    approvalText: { color: '#475569', fontWeight: '700', textAlign: 'center' },
    approvalTextSelected: { color: '#fff' },
    saveButton: {
        backgroundColor: '#0b2d6b',
        padding: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    imageRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginHorizontal: 16 },
    image: { width: 90, height: 90, borderRadius: 10, borderWidth: 1, borderColor: '#999' },
    fullImage: { width: '90%', height: '70%', borderRadius: 12 },
    closeButton: { marginTop: 20, backgroundColor: '#ff0000cc', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
    closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContent: { alignItems: 'center', justifyContent: 'center', width: '100%' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.85)', justifyContent: 'center', alignItems: 'center' },
});

export default RegistroLecturasScreen;
