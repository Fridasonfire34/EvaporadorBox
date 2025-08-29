import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InicioScreen = () => {
    const [user, setUser] = useState<any>(null);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [jobsData, setJobsData] = useState([]);

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };

        loadUserData();
        fetchJobsFromAPI();
    }, []);

    const fetchJobsFromAPI = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://192.168.16.192:3002/api/evaporador/job');
            if (!response.ok) {
                throw new Error('Error al obtener los jobs');
            }
            const data = await response.json();

            setJobsData(data.jobs || data);
        } catch (error) {
            console.error('Error al cargar jobs:', error);
            Alert.alert('Error', 'No se pudieron cargar los jobs. Intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Evaporador BOX</Text>
                <Text style={styles.welcomeText}> {user.Nomina}</Text>
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
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Menu', {
                job: item["Job Number"],
                nomina: user.Nomina,
            })}
        >
            <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item["Job Number"]}</Text>
            </View>
        </TouchableOpacity>
    )}
/>
                    </>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
     loadingText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 80,
    },
    container: {
        backgroundColor: '#fff',
    },
    headerBox: {
        backgroundColor: '#0011ffff',
        padding: 15,
        marginBottom: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    welcomeText: {
        position: 'absolute',
        right: 15,
        top: 15,
        color: '#fff',
        fontSize: 14,
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
        fontSize: 16,
        paddingHorizontal: 5,
    },


});


export default InicioScreen;
