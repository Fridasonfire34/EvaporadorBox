import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const JobsScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.btn}>
                <Text>Mostrar Modal</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <Text style={{ color: 'white', fontSize: 22 }}>¡Modal abierto!</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnClose}>
                        <Text style={{ color: 'white' }}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    btn: { padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
    btnClose: { marginTop: 20, padding: 10, backgroundColor: 'red', borderRadius: 5 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
});

export default JobsScreen;