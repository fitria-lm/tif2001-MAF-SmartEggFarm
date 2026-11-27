-- Smart Egg Farm: struktur database (PostgreSQL, Neon)
-- Jalankan berurutan pada database kosong. Urutan penting karena foreign key.

CREATE TABLE users (
  id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username  VARCHAR(50)  NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  nama      VARCHAR(100) NOT NULL,
  role      VARCHAR(20)  NOT NULL
            CHECK (role IN ('owner', 'pekerja', 'kasir'))
);

CREATE TABLE kandang (
  id_kandang         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama_kandang       VARCHAR(50) NOT NULL UNIQUE,
  kapasitas          INTEGER     NOT NULL CHECK (kapasitas > 0),
  populasi_awal      INTEGER     NOT NULL CHECK (populasi_awal >= 0),
  tanggal_masuk      DATE        NOT NULL,
  umur_masuk_minggu  INTEGER     NOT NULL CHECK (umur_masuk_minggu >= 0),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE kematian (
  id_kematian  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_kandang   INTEGER     NOT NULL REFERENCES kandang (id_kandang) ON DELETE RESTRICT,
  tanggal      DATE        NOT NULL,
  jumlah       INTEGER     NOT NULL CHECK (jumlah > 0),
  penyebab     VARCHAR(100),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE panen (
  id_panen    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_kandang  INTEGER     NOT NULL REFERENCES kandang (id_kandang) ON DELETE RESTRICT,
  tanggal     DATE        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE panen_detail (
  id_detail       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_panen        INTEGER       NOT NULL REFERENCES panen (id_panen) ON DELETE CASCADE,
  tipe_telur      VARCHAR(10)   NOT NULL CHECK (tipe_telur IN ('A', 'B', 'C')),
  jumlah_telur    INTEGER       NOT NULL CHECK (jumlah_telur > 0),
  berat_panen_kg  NUMERIC(8,1)  NOT NULL CHECK (berat_panen_kg > 0),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (id_panen, tipe_telur)
);

CREATE TABLE order_telur (
  id_order         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama_pembeli     VARCHAR(100)  NOT NULL,
  tanggal          DATE          NOT NULL,
  tipe_telur       VARCHAR(10)   NOT NULL CHECK (tipe_telur IN ('A', 'B', 'C')),
  berat_kg         NUMERIC(8,2)  NOT NULL CHECK (berat_kg > 0),
  harga_per_kg     INTEGER       NOT NULL CHECK (harga_per_kg > 0),
  status           VARCHAR(10)   NOT NULL DEFAULT 'antrean'
                   CHECK (status IN ('antrean', 'selesai')),
  tanggal_selesai  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  CHECK ((status = 'selesai') = (tanggal_selesai IS NOT NULL))
);

CREATE TABLE pengeluaran (
  id_pengeluaran  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tanggal         DATE          NOT NULL,
  kategori        VARCHAR(30)   NOT NULL,
  keterangan      VARCHAR(255),
  nominal         INTEGER       NOT NULL CHECK (nominal > 0),
  jenis_bahan     VARCHAR(20),
  jumlah_kg       NUMERIC(8,2)  CHECK (jumlah_kg > 0),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);