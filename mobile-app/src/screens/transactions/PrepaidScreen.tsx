import React, { useState } from 'react';
import {

View,
Text,
TouchableOpacity,
FlatList,
StyleSheet,
Alert,
Modal,
} from 'react-native';
import Input from '../../components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';

// Dummy data for products (fixed denom)
const PRODUCTS = [
{ id: '1', name: 'Pulsa 10.000', price: 12000 },
{ id: '2', name: 'Pulsa 20.000', price: 22000 },
{ id: '3', name: 'Paket Data 1GB', price: 15000 },
{ id: '4', name: 'E-Wallet 50.000', price: 51000 },
];

const PrepaidScreen = ({ navigation, route }: any) => {
    const { name } = route.params;
    const [step, setStep] = useState<'input' | 'select' | 'pin' | 'done'>('input');
    const [phone, setPhone] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
    const [pin, setPin] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);

    const handleNext = () => {
        if (step === 'input') {
            if (!phone.match(/^[0-9]{10,13}$/)) {
                Alert.alert('Nomor tidak valid');
                return;
            }
            setStep('select');
        }
    };

    const handleProductSelect = (product: typeof PRODUCTS[0]) => {
        setSelectedProduct(product);
        setShowPinModal(true);
    };

    const handlePinConfirm = () => {
        if (pin.length < 4) {
            Alert.alert('PIN minimal 4 digit');
            return;
        }
        setShowPinModal(false);
        setStep('done');
        setTimeout(() => {
            setStep('input');
            setPhone('');
            setSelectedProduct(null);
            setPin('');
        }, 2000);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header title={name} />
        <View style={styles.container}>
            <Text style={styles.title}>Transaksi Prepaid</Text>

            {step === 'input' && (
                <View style={{ flex: 1, gap: 10 }}>
                    <Text style={styles.label}>Nomor Tujuan</Text>
                    <Input
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Masukkan nomor tujuan"
                        keyboardType="phone-pad"
                        maxLength={13}
                    />
                    <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Pilih Produk</Text>
                        <FlatList
                            data={PRODUCTS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.productItem}
                                    onPress={() => handleProductSelect(item)}
                                >
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>Rp{item.price.toLocaleString()}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            )}

            <Modal visible={showPinModal} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Konfirmasi PIN</Text>
                        <Input
                            value={pin}
                            onChangeText={setPin}
                            placeholder="Masukkan PIN Anda"
                            secureTextEntry
                            keyboardType="numeric"
                            maxLength={6}
                        />
                        <TouchableOpacity style={styles.button} onPress={handlePinConfirm}>
                            <Text style={styles.buttonText}>Bayar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowPinModal(false)}>
                            <Text style={{ color: 'red', marginTop: 10 }}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {step === 'done' && (
                <View style={styles.doneContainer}>
                    <Text style={styles.doneText}>Transaksi Berhasil!</Text>
                </View>
            )}
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8 },
    input: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        padding: 10, marginBottom: 16,
    },
    button: {
        backgroundColor: '#007bff', padding: 12, borderRadius: 8,
        alignItems: 'center', marginBottom: 10,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    productItem: {
        flexDirection: 'row', justifyContent: 'space-between',
        padding: 16, borderBottomWidth: 1, borderColor: '#eee',
        backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 10,
    },
    productName: { fontSize: 16 },
    productPrice: { fontSize: 16, fontWeight: 'bold' },
    modalContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        backgroundColor: '#fff', 
        padding: 24, 
        borderRadius: 10, 
        width: '80%',
        gap: 10,
        alignItems: 'center',
    },
    doneContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    doneText: { fontSize: 20, color: 'green', fontWeight: 'bold' },
    });

export default PrepaidScreen;