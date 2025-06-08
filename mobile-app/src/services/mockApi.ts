// Mock data
const mockUsers = [
  {
    kode: 'USER001',
    nohp: '081234567890',
    hakAkses: 'reseller',
    saldo: 1000000,
    markupReseller: 500,
    kodeMlm: 'MLM001',
    aktif: 1
  }
];

const mockProducts = [
  {
    kode: 'PROD001',
    nama: 'Pulsa 10K',
    harga_jual1: 11000,
    jumlah_Stok_unit: 100,
    keterangan: 'Pulsa 10.000'
  },
  {
    kode: 'PROD002',
    nama: 'Pulsa 20K',
    harga_jual1: 21000,
    jumlah_Stok_unit: 100,
    keterangan: 'Pulsa 20.000'
  }
];

const mockTransactions = [
  {
    status: 'success',
    trxid: 'TRX001',
    sn: 'SN001',
    saldo_terpotong: 11000,
    saldo_sekarang: 989000,
    produk: 'PROD001',
    tujuan: '081234567890',
    created_at: new Date().toISOString()
  }
];

// Mock API responses with error handling
export const mockAuthApi = {
  login: async (kode: string, pin: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!kode || !pin) {
      throw { response: { data: { message: 'Please fill in all fields' } } };
    }

    if (kode === 'USER001' && pin === '123456') {
      return { success: true };
    }
    throw { response: { data: { message: 'Invalid credentials' } } };
  },

  verifyOtp: async (kode: string, otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!otp) {
      throw { response: { data: { message: 'Please enter OTP' } } };
    }

    if (otp === '123456') {
      const user = mockUsers.find(u => u.kode === kode);
      return {
        token: 'mock-token',
        reseller: user
      };
    }
    throw { response: { data: { message: 'Invalid OTP' } } };
  }
};

export const mockProductsApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockProducts;
  }
};

export const mockTransactionsApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTransactions;
  },

  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!data.tujuan) {
      throw { response: { data: { message: 'Phone number is required' } } };
    }

    const newTransaction = {
      status: 'success',
      trxid: `TRX${Math.random().toString(36).substr(2, 9)}`,
      sn: `SN${Math.random().toString(36).substr(2, 9)}`,
      saldo_terpotong: data.qty * 11000,
      saldo_sekarang: 989000 - (data.qty * 11000),
      produk: data.produk,
      tujuan: data.tujuan,
      created_at: new Date().toISOString()
    };
    mockTransactions.unshift(newTransaction);
    return newTransaction;
  }
};
