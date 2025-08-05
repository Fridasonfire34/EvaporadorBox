import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InicioScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [jobsData, setJobsData] = useState([
        { id: '1', fecha: '2025-08-01', job: 'JOB-001' },
        { id: '2', fecha: '2025-08-02', job: 'JOB-002' },
        { id: '3', fecha: '2025-08-03', job: 'JOB-003' },
    ]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Evaporador BOX</Text>
            </View>
            {/* DRAIN PAN */}
            <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>Elige un job:</Text>
            </View>
            {/* Tabla de Jobs */}
            <View style={styles.tableWrapper}>
                {loading ? (
                    <ActivityIndicator size="large" color="#000000ff" />
                ) : (
                    <>

                        {/* Filas */}
                        <FlatList
                            data={jobsData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Menu', {
                                        fecha: item.fecha,
                                        job: item.job,
                                    })}
                                >
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{item.job}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
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
        marginLeft: 1
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
    tableWrapper: {
        marginHorizontal: 10,
        marginTop: 5,
        paddingBottom: 20,
    },

    tableHeader: {
        flexDirection: 'row',
        ///backgroundColor: '#0011ffff',
        paddingVertical: 10,
        paddingHorizontal: 5,
        color: 'black'
    },

    tableHeaderText: {
        color: '#black',
        fontWeight: 'bold',
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },

    tableCell: {
        flex: 1,
        fontSize: 14,
        paddingHorizontal: 5,
    },


});


export default InicioScreen;
