import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistComments, ChecklistHeader, checklistStyles } from './ChecklistUI';

type Props = {
    title: string;
    endpoint: string;
    tiempoDisparo: string;
};

type FormData = {
    temperatura: string;
    pesoAntes: string;
    pesoDespues: string;
    maquinado: string;
    termometroId: string;
    comentarios: string;
};

type RouteParams = { Pesos: { job: string | number } };

export default function PesosForm({ title, endpoint, tiempoDisparo }: Props) {
    const { job } = useRoute<RouteProp<RouteParams, 'Pesos'>>().params;
    const navigation = useNavigation();
    const [user, setUser] = useState<{ Nomina: string } | null>(null);
    const [approvalStatus, setApprovalStatus] = useState<'approved' | 'notApproved' | null>(null);
    const [tiempoChecked, setTiempoChecked] = useState(false);
    const [saving, setSaving] = useState(false);
    const savingRef = useRef(false);
    const [data, setData] = useState<FormData>({
        temperatura: '',
        pesoAntes: '',
        pesoDespues: '',
        maquinado: '',
        termometroId: '',
        comentarios: '',
    });
    const fechaISO = new Date().toISOString();
    const date = new Date(fechaISO);
    const fecha = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

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
            <View style={checklistStyles.background}>
                <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
            </View>
        );
    }

    const handleChange = (field: keyof FormData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const saveData = async (fromConfirm: boolean) => {
        if (savingRef.current) {
            return;
        }
        savingRef.current = true;
        setSaving(true);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job,
                    fecha: fechaISO,
                    nomina: user.Nomina,
                    temperatura: data.temperatura,
                    pesoAntes: data.pesoAntes,
                    pesoDespues: data.pesoDespues,
                    maquinado: data.maquinado,
                    termometroId: data.termometroId,
                    comentarios: data.comentarios,
                    tiempodisparo: tiempoChecked || fromConfirm ? tiempoDisparo : null,
                    aprobado: approvalStatus === 'approved' ? 'SI' : 'NO',
                }),
            });
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }
            const result = await response.json();
            if (result.success === false) {
                Alert.alert('Error', result.message || 'No se pudieron guardar los datos.');
                savingRef.current = false;
                setSaving(false);
                return;
            }
            Alert.alert('Guardado', 'Los datos se guardaron correctamente.', [
                { text: 'Aceptar', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error al guardar:', error);
            Alert.alert('Error', 'No se pudieron guardar los datos. Intenta de nuevo.');
            savingRef.current = false;
            setSaving(false);
        }
    };

    const onSave = () => {
        if (savingRef.current) {
            return;
        }
        if (!tiempoChecked) {
            Alert.alert('Confirmación requerida', 'Favor de confirmar el tiempo de disparo', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => saveData(true) },
            ]);
        } else {
            saveData(false);
        }
    };

    return (
        <View style={checklistStyles.background}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
            >
                <ScrollView contentContainerStyle={checklistStyles.scrollContent} keyboardShouldPersistTaps="handled">
                    <ChecklistHeader
                        label="REGISTRO DE PESOS Y ESPUMADO"
                        title={title}
                        date={fecha}
                        job={job}
                        nomina={user.Nomina}
                    />
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Temperatura de molde °F</Text>
                        <Text style={styles.hint}>Tolerancia 105° - 125°</Text>
                        <TextInput
                            style={styles.input}
                            value={data.temperatura}
                            onChangeText={value => handleChange('temperatura', value)}
                            keyboardType="numeric"
                            accessibilityLabel="Temperatura de molde"
                        />
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Pesos (libras)</Text>
                        <View style={styles.row}>
                            <View style={styles.field}>
                                <Text style={styles.label}>Antes</Text>
                                <TextInput
                                    style={styles.input}
                                    value={data.pesoAntes}
                                    onChangeText={value => handleChange('pesoAntes', value)}
                                    keyboardType="numeric"
                                    accessibilityLabel="Peso antes"
                                />
                            </View>
                            <View style={styles.field}>
                                <Text style={styles.label}>Después</Text>
                                <TextInput
                                    style={styles.input}
                                    value={data.pesoDespues}
                                    onChangeText={value => handleChange('pesoDespues', value)}
                                    keyboardType="numeric"
                                    accessibilityLabel="Peso después"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Equipo y tiempo de disparo</Text>
                        <Text style={styles.label}>Máquina de espumado</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={data.maquinado}
                                onValueChange={value => handleChange('maquinado', value)}
                                style={styles.picker}
                                accessibilityLabel="Máquina de espumado"
                            >
                                <Picker.Item label="Seleccione una opción" value="" />
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                            </Picker>
                        </View>
                        <Text style={styles.label}>ID termómetro</Text>
                        <TextInput
                            style={styles.input}
                            value={data.termometroId}
                            onChangeText={value => handleChange('termometroId', value)}
                            accessibilityLabel="ID termómetro"
                        />
                        <Text style={styles.label}>Tiempo de disparo</Text>
                        <TouchableOpacity
                            style={[styles.timeRow, tiempoChecked && styles.timeRowChecked]}
                            onPress={() => setTiempoChecked(!tiempoChecked)}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: tiempoChecked }}
                            accessibilityLabel={`Confirmar tiempo de disparo ${tiempoDisparo}`}
                        >
                            <Text style={styles.timeText}>{tiempoDisparo}</Text>
                            <Text style={styles.timeAction}>{tiempoChecked ? 'Confirmado ✓' : 'Confirmar'}</Text>
                        </TouchableOpacity>
                    </View>
                    <ChecklistComments value={data.comentarios} onChange={value => handleChange('comentarios', value)} />
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Resultado</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.approvalButton, approvalStatus === 'approved' && styles.approved]}
                                onPress={() => setApprovalStatus('approved')}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: approvalStatus === 'approved' }}
                            >
                                <Text style={[styles.approvalText, approvalStatus === 'approved' && styles.selectedText]}>
                                    APROBADO
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.approvalButton, approvalStatus === 'notApproved' && styles.notApproved]}
                                onPress={() => setApprovalStatus('notApproved')}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: approvalStatus === 'notApproved' }}
                            >
                                <Text style={[styles.approvalText, approvalStatus === 'notApproved' && styles.selectedText]}>
                                    NO APROBADO
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={onSave} disabled={saving}>
                        <Text style={styles.saveText}>{saving ? 'GUARDANDO...' : 'GUARDAR'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingText: { fontSize: 14, textAlign: 'center', marginTop: 80 },
    keyboard: { flex: 1 },
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
    hint: { color: '#64748b', fontSize: 13, marginBottom: 8 },
    label: { color: '#1a1a2e', fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 6 },
    row: { flexDirection: 'row', gap: 12 },
    field: { flex: 1 },
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
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 48,
        borderWidth: 1,
        borderColor: '#dbe3ef',
        borderRadius: 10,
        backgroundColor: '#f8f9fc',
        paddingHorizontal: 12,
    },
    timeRowChecked: { backgroundColor: '#e8f5e9', borderColor: '#a5d6a7' },
    timeText: { color: '#1a1a2e', fontSize: 16, fontWeight: '700' },
    timeAction: { color: '#2e7d32', fontSize: 14, fontWeight: '700' },
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
    selectedText: { color: '#fff' },
    saveButton: {
        backgroundColor: '#0b2d6b',
        padding: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
