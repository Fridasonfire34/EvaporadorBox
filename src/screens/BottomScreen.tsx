import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistComments, ChecklistHeader, ChecklistItem, checklistStyles } from '../components/ChecklistUI';


const BottomScreen = () => {
    const route = useRoute();
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [user, setUser] = useState<any>(null);
    const navigation = useNavigation();
    const [comentarios, setComentarios] = useState('');
    const [statusChecked, setStatusChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState(
     Array(8).fill(false)
    );
    const fechaISO = new Date().toISOString();
    const formatFechaLocal = (fechaISO: string) => {
    const date = new Date(fechaISO);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // enero es 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    const {job } = route.params || {};

    const imageList = [
        { id: 1, src: require('../assets/BOTTOM1.png') },
        { id: 2, src: require('../assets/BOTTOM2.png') },
        { id: 3, src: require('../assets/BOTTOM3.png') },
        { id: 4, src: require('../assets/BOTTOM4.png') },
        { id: 5, src: require('../assets/BOTTOM5.png') },
        { id: 6, src: require('../assets/BOTTOM6.png') },
    ];

    const row1 = imageList.slice(0,6);

    useEffect(() => {
            if (checkedItems.every(item => item)) {
                setStatusChecked(true);
            } else {
                setStatusChecked(false);
            }
        }, [checkedItems]);

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
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
            </View>
        );
    }

    const handleIncomplete = () => {
  Alert.alert(
    'Verificación Incompleta',
    'No todos los puntos han sido verificados. ¿Deseas continuar?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sí',
        onPress: async () => {
          const payload = {
            job,
            fecha: fechaISO,
            nomina: user?.Nomina,
            checkboxes: checkedItems,
            comentarios
          };

          try {
            const response = await fetch('http://192.168.15.155:3002/api/evaporador/incompleteBottom', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });

            console.log('Response: ', response);
            const result = await response.json();

            if (result.success) {
              Alert.alert('Enviado', 'Checklist enviado como INCOMPLETO.');

              try {
                await fetch('http://192.168.15.155:3002/api/evaporador/completeJobs', {
                  method: 'POST',
                });
              } catch (error) {
                console.error('Error al llamar a completeJobs:', error);
              }

              navigation.navigate('ProcesoScreen', { job });

            } else {
              Alert.alert('Error al registrar los datos');
            }
          } catch (error) {
            console.error('Error al guardar:', error);
            Alert.alert('Error', 'No se pudo enviar el checklist incompleto.');
          }
        },
      },
    ]
  );
};

        const handleComplete = async () => {
                console.log('Payload enviado:', {
          job,
          fecha: fechaISO,
          nomina: user?.Nomina,
          checkboxes: checkedItems,
          comentarios
        });
        
                try { const response = await fetch ('http://192.168.15.155:3002/api/evaporador/completeBottom', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            job,
                            fecha: fechaISO,
                            nomina: user?.Nomina,
                            checkboxes: checkedItems,
                            comentarios
                        }),
                    });
                    const result = await response.json();
                    
                        if (result.success) {
                          Alert.alert('Enviado', 'Checklist enviado como COMPLETO.');
                    
                          try {
                            await fetch('http://192.168.15.155:3002/api/evaporador/completeJobs', {
                              method: 'POST',
                            });
                          } catch (error) {
                            console.error('Error al llamar a completeJobs:', error);
                          }
                    
                          navigation.navigate('ProcesoScreen', { job });
                        } else {
                          console.log('Respuesta del servidor:', result);
                          Alert.alert('Error al registrar los datos', result.message || 'Error desconocido');
                        }
                    
                      } catch (error) {
                        console.error('Error al guardar:', error);
                        Alert.alert('Error', 'No se pudo enviar el checklist completo.');
                      }
                    };

    return (
    <View style={checklistStyles.background}>
 <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
    >
      <ScrollView contentContainerStyle={checklistStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <ChecklistHeader
            title="ASSEMBLY BOX, BOTTOM"
            date={formatFechaLocal(fechaISO)}
            job={job}
            nomina={user.Nomina}
            instructions="Garantizar que todos los componentes necesarios se encuentren disponibles antes de iniciar el proceso de ensamble. Primero, identifique el componente en cuestión y compare la cantidad especificada en el check list de referencia con la cantidad disponible. Marque el recuadro correspondiente. En caso de que no se cuente con la cantidad adecuada, registre la discrepancia en el campo de observaciones."
        />
        <Text style={checklistStyles.sectionHeading}>Componentes a verificar</Text>

    {/* Filas de datos */}
    {[
    [1, "ASSEMBLY, BASE, EVAP BOX", "4490186", "1"],
    [2, "ASSEMBLY, DRAIN PAN RECEIVER, LEFT", "4490348", "1"],
    [3, "ASSEMBLY, DRAIN PAN RECEIVER, RIGHT", "4490349", "1"],
    [4, 'ASSEMBLY, DRAIN PAN', "4490188", "2"],
    [5, '#8-32 X 3/8" SS THP SCREW', "2040007", "8"],
    [6, 'FLAT WASHER, 18-8 SS, 1/4"', "2220005", "8"],
    [7, 'RIVET, ALUMINUM, BLIND, 3/16" DIA, 0.063" - 0.125", THK', "2120004", "8"],
    [8, 'PASSTHRU. BOTTOM, EVAP BOX, ULC"', "9010618", "2"],
].map(([item, desc, part, qty], idx) => (
    <ChecklistItem
        key={idx}
        title={`${item}. ${desc}`}
        detail={`Núm. de parte: ${part}   ·   Cantidad: ${qty}`}
        checked={!!checkedItems[idx]}
        onChange={(value) => {
            const updated = [...checkedItems];
            updated[idx] = value;
            setCheckedItems(updated);
        }}
    />
))}
            <ChecklistComments value={comentarios} onChange={setComentarios} complete={statusChecked} />
            {/* Botón Guardar */}
             <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                          if (!statusChecked) {
                            handleIncomplete();
                          } else {
                            handleComplete();
                          }
                        }}
                        >
                            <Text style={styles.saveButtonText}>GUARDAR</Text>
                            </TouchableOpacity>

            {/* Imágenes */}
            <View style={styles.imageRow}>
    {row1.map((img) => (
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
        {/* Modal */}
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
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>CERRAR</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
        </ScrollView>
                            </KeyboardAvoidingView>
    </View>
);

};

const styles = StyleSheet.create({
     loadingText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 80,
    },
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
    normal: {
        fontSize: 14,
        color: 'white',
        marginRight: 50
    },
    bold2: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    },
    saveButton: {
        backgroundColor: '#0b2d6b',
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#999',
        backgroundColor: '#ffffffff',
        marginHorizontal: 10,
    },
    closeButton: {
        marginBottom: 20,
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
    tableContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#fff',
},
    tableRow: {
    flexDirection: 'row',
    borderColor: 'black'
},
tableCellBase: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
},
tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderColor: 'black',
    alignItems: 'center'
},
headerCell: {
    flex: 1,
    padding: 6,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
},
 headerTABLE: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 12,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
},
tableCellHeader: {
    flex: 1,
    padding: 8,
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderColor: 'black',
    fontSize: 12,
    textAlign: 'center',
},
tableText: {
    fontSize: 12,
    textAlign: 'center',
},
tableText2: {
    fontSize: 12,
     fontWeight: 'bold',
    textAlign: 'center',
},
colItem: {
    width: 40,
},
colDesc: {
    flex: 1,
},
colPart: {
    width: 70,
},
colQty: {
    width: 40,
},
colStatus: {
    width: 55,
},
colBlow: {
    width: 60,
},
colVer: {
    width: 120,
},
colDist: {
    width: 80,
},
colMed:{
    width: 60,
},
colInput:{
    width: 60
},
colOBS:{
    flex: 4
},
colOBST:{
    flex: 4
},
colStat:{
    flex: 0.3
},
tableContainer2: {
  marginVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#fff',
},
tableRow2: {
  flexDirection: 'row',
},
tableCellBase3: {
  borderWidth: 1,
  borderColor: 'black',
  padding: 6,
  justifyContent: 'center',
  alignItems: 'center',
},
inputText: {
  fontSize: 12,
  padding: 4,
  textAlign: 'center',
  width: '100%',
  color: 'black'
},

});

export default BottomScreen;
