import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

type Job = {
    'Job Number': string | number;
};

type InicioNavigation = NavigationProp<{
    Menu: {
        job: string | number;
        nomina: string;
    };
}>;

const InicioScreen = () => {
    const [user, setUser] = useState<{ Nomina: string } | null>(null);
    const navigation = useNavigation<InicioNavigation>();
    const [loading, setLoading] = useState(false);
    const [jobsData, setJobsData] = useState<Job[]>([]);
    const [searchText, setSearchText] = useState('');
    const filteredJobs = jobsData.filter((item) =>
        String(item['Job Number'])
            .toLowerCase()
            .includes(searchText.trim().toLowerCase()),
    );

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
            const response = await fetch('http://192.168.15.155:3002/api/evaporador/job');
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
                <Text style={styles.welcomeText}>Hola, {user.Nomina}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Selecciona un job</Text>
                <View style={styles.searchBox}>
                    <Icon name="search" size={20} color="#64748B" />
                    <TextInput
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Buscar job..."
                        placeholderTextColor="#64748B"
                        returnKeyType="search"
                        accessibilityLabel="Buscar job"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchText('')}
                            accessibilityRole="button"
                            accessibilityLabel="Limpiar búsqueda"
                        >
                            <Icon name="close-circle" size={20} color="#64748B" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.jobsCount}>
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job disponible' : 'jobs disponibles'}
                </Text>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0B4DBB" />
                    </View>
                ) : (
                    <FlatList
                        style={styles.jobsList}
                        data={filteredJobs}
                        keyExtractor={(item, index) =>
                            String(item['Job Number'] ?? index)
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                activeOpacity={0.75}
                                accessibilityRole="button"
                                accessibilityLabel={`Abrir job ${item['Job Number']}`}
                                onPress={() =>
                                    navigation.navigate('Menu', {
                                        job: item['Job Number'],
                                        nomina: user.Nomina,
                                    })
                                }
                            >
                                <Text style={styles.cardText}>{item['Job Number']}</Text>
                                <Icon name="chevron-forward" size={22} color="#0B4DBB" />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                {jobsData.length === 0
                                    ? 'No hay jobs disponibles.'
                                    : 'No se encontraron jobs con esa búsqueda.'}
                            </Text>
                        }
                    />
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
        flex: 1,
        backgroundColor: '#fff',
    },
    headerBox: {
        backgroundColor: '#196cb5e4',
        paddingHorizontal: 20,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    welcomeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 18,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#D5DFEC',
        borderWidth: 1,
        borderRadius: 10,
        minHeight: 52,
        paddingHorizontal: 14,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000000e4',
        paddingVertical: 10,
        paddingLeft: 10,
    },
    jobsCount: {
        color: '#000000',
        fontSize: 14,
        marginTop: 18,
        marginBottom: 10,
    },
    jobsList: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 96,
        flexGrow: 1,
    },
    card: {
        minHeight: 76,
        backgroundColor: '#196cb5',
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#636363',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#196cb5e4',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 32,
    },
});


export default InicioScreen;
