# Panduan Gambar Hero Slider

Acuan ukuran gambar untuk koleksi `hero_slider` di Directus.
Semua URL gambar dipaksa ke rasio di bawah ini (`width` + `height` + `fit=cover`),
jadi file yang rasionya meleset akan **dipotong dari tengah**, bukan diregangkan.

## Tabel field

| Field | Rasio | Ukuran upload | Breakpoint tampil | Status |
|---|---|---|---|---|
| `image` | **16:9** | **2560 × 1440** (min. 1920 × 1080) | desktop 1024–1919px | wajib |
| `image_mobile` | **4:5** | **1080 × 1350** | mobile ≤639px | opsional |
| `image_tablet` | **4:3** | **1600 × 1200** | tablet 640–1023px | opsional |
| `image_wide` | **21:9** | **2560 × 1100** | wide ≥1920px | opsional |

Jika field varian kosong, situs memakai `image` (master) dan memotongnya otomatis
ke rasio target. Jadi minimal **`image` harus terisi**; kalau `image` kosong,
slide akan menampilkan placeholder gradient, bukan gambar.

## Cara kerja di halaman

```
image (master 16:9)
├── desktop 1024–1919px  -> dipakai langsung (srcset 1280×720 / 1920×1080 / 2560×1440)
├── mobile  ≤639px       -> image_mobile,  fallback crop 4:5   dari image
├── tablet  640–1023px   -> image_tablet,  fallback crop 4:3   dari image
└── wide    ≥1920px      -> image_wide,    fallback crop 21:9  dari image
```

Urutan `<source>` di `<picture>`: wide → tablet → mobile → `<img>` (desktop).
Browser memakai source pertama yang cocok dengan media query.

## Kenapa rasionya berbeda-beda

Tinggi hero dibatasi (`clamp`), sedangkan lebarnya mengikuti viewport:

| Viewport | Ukuran hero | Rasio hero |
|---|---|---|
| 390 × 844 | 390 × 540 | 0.72 : 1 |
| 768 × 1024 | 768 × 635 | 1.21 : 1 |
| 1366 × 768 | 1366 × 560 | 2.44 : 1 |
| 1920 × 1080 | 1920 × 620 | 3.10 : 1 |
| 2560 × 1440 | 2560 × 620 | 4.13 : 1 |

Karena rasionya berubah drastis, satu gambar tidak bisa ideal untuk semua ukuran.
Crop manual per breakpoint membuat komposisi tetap terkontrol.

## Aturan komposisi

- Taruh subjek utama di **tengah** gambar (Directus memotong dari tengah).
- Safe area: **±50% lebar × ±60% tinggi** di bagian tengah.
- Untuk slide dengan `text_position = left`, sisakan ruang kosong di **kiri**;
  untuk `right`, sisakan ruang kosong di **kanan**.
- Jangan taruh wajah/teks penting di 15–20% pinggir gambar.

## Format & ukuran file

- Format: **WebP**, kualitas **75–80** (situs juga meminta `format=webp`).
- Target ukuran file:
  - 1080 × 1350: **< 200 KB**
  - 1600 × 1200: **< 300 KB**
  - 2560 × 1440: **< 450 KB**
  - 2560 × 1100: **< 350 KB**
- Upload resolusi lebih tinggi tidak masalah (akan di-resize), tetapi jangan
  upload file di bawah ukuran tabel agar tidak upscale.

## Field lain yang terkait

| Field | Fungsi |
|---|---|
| `text_position` | `center` (default) / `left` / `right` — posisi blok teks dan arah overlay |
| `sort` | urutan slide |
| `status` | hanya slide berstatus publish yang tampil |
| `button_link` | URL tombol CTA |
| `translations.*` | judul, subjudul, teks tombol per bahasa |
