export interface User {
  kode: string;
  nohp: string;
  hakAkses: string;
  saldo: number;
  markupReseller: number;
  kodeMlm: string;
  aktif: number;
}

export interface Product {
  kode: string;
  nama: string;
  harga_jual1: number;
  jumlah_Stok_unit: number;
  keterangan: string;
}

export interface Provider {
  kode: string;
  nama: string;
  prefixTujuan: string;
  regexTujuan: string;
  gangguan: number;
  kosong: number;
}

export interface Transaction {
  status: string;
  trxid: string;
  sn: string;
  saldo_terpotong: number;
  saldo_sekarang: number;
  produk?: string;
  tujuan?: string;
  created_at?: string;
}
