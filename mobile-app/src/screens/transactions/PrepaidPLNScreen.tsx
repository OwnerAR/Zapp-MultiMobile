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
import SuccessMessage from '../../components/SuccessMessage';

interface Customer {
  id: string;
  name: string;
  Golongan: string;
  Address: string;
}
// Dummy data for products (fixed denom)
const PRODUCTSPLN = [
    { id: '1', name: 'Token PLN 20.000', price: 22000 },
    { id: '2', name: 'Token PLN 50.000', price: 51000 },
    { id: '3', name: 'Token PLN 100.000', price: 102000 },
    { id: '4', name: 'Token PLN 200.000', price: 204000 },
    { id: '5', name: 'Token PLN 500.000', price: 510000 },
    { id: '6', name: 'Token PLN 1.000.000', price: 1020000 },
    { id: '7', name: 'Token PLN 2.000.000', price: 2040000 },
];

const MOCKIDPELANGGAN = (customerID: string) => ({
    id: customerID,
    name: 'John Doe',
    Golongan: 'R1',
    Address: 'Jl. Kebon Jeruk No. 1',
});

const PrepaidPLNScreen = ({ navigation, route }: any) => {
    const { name } = route.params;
    const [step, setStep] = useState<'input' | 'select' | 'pin' | 'done'>('input');
    const [phone, setPhone] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTSPLN[0] | null>(null);
    const [pin, setPin] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(null);

    const handleCheckId = () => {
        const customer = MOCKIDPELANGGAN(phone);
        if (customer) {
            setCustomer(customer);
        } else {
            Alert.alert('ID Pelanggan Tidak Ditemukan');
        }
    };

    const handleProductSelect = (product: typeof PRODUCTSPLN[0]) => {
        setSelectedProduct(product);
        setShowPinModal(true);
    };

    const handlePinConfirm = () => {
        if (pin.length < 6) {
            Alert.alert('PIN minimal 6 digit');
            return;
        }
        setShowPinModal(false);
        setStep('done');
        setTimeout(() => {
            setStep('input');
            setPin('');
        }, 2000);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header title={name} />
            <View style={styles.container}>
                <Text style={styles.title}>Transaksi PLN Prepaid</Text>

                {step === 'input' && (
                    <View style={{ flex: 1, gap: 10 }}>
                        <Text style={styles.label}>Nomor Pelanggan</Text>
                        <Input
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Masukkan nomor pelanggan"
                            keyboardType="phone-pad"
                            maxLength={13}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleCheckId}>
                            <Text style={styles.buttonText}>Cek</Text>
                        </TouchableOpacity>
                            {customer && (
                                <View style={{ backgroundColor: '#f1f5f9', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Data Pelanggan:</Text>
                                    <Text>ID: {customer.id}</Text>
                                    <Text>Nama: {customer.name}</Text>
                                    <Text>Golongan: {customer.Golongan}</Text>
                                    <Text>Alamat: {customer.Address}</Text>
                                </View>
                            )}
                        <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Pilih Produk</Text>
                            <FlatList
                                data={PRODUCTSPLN}
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
            </View>
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
                <SuccessMessage
                    message="Transaksi Berhasil!"
                    onDismiss={() => {
                        setStep('input');
                        setPhone('');
                        setSelectedProduct(null);
                        setPin('');
                        setCustomer(null);
                    }}
                />
            )}
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
});

export default PrepaidPLNScreen;