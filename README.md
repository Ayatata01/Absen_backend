# Absen_backend
### Deskripsi API
API ini adalah hasil dari proyek skripsi saya yang berjudul perancangan sistem presensi mahasiswa universitas islam riau dengan metode geolocation, aplikasi ini dibuat dengan tujuan untuk mempermudah dosen dan mahasiswa dalam melakukan proses presensi dan memanajemen data presensi dengan memanfaatkan geolocation.

cara kerja aplikasi :
1. dosen membuat kelas berdasarkan lokasi dosen saat ini dan menginputkan jarak/radius kelas, jika berhasil maka akan muncul response kode kelas.
2. mahasiswa menginputkan kode kelas untuk dapat hadir ke kelas dosen yang dituju.
3. sistem mengukur jarak antara mahasiswa dan dosen, jika jarak mahasiswa dengan dosen tidak lebih dari radius yang diinputkan dosen, selanjutnya mahasiswa dapat mengisi kehadiran.

API ini akan diintegrasikan dengan aplikasi android yang dibuat dengan framework react-native.

### Fitur
1. Login dengan akun email universitas islam riau (uir) yang akan memberi response jwt
2. Membuat kelas (email dosen)
3. Menambah kehadiran (email mahasiswa)
4. Menampilkan seluruh data kelas yang dibuat oleh dosen
5. Menampilkan seluruh data presensi yang dilakukan oleh mahasiswa
6. Mencari data kelas (dosen)
7. Mengedit status kelas (dosen)
8. Mencari data presensi (mahasiswa)
9. Menghapus data kelas (dosen)
10. Menghapus data kehadiran (mahasiswa)

### Teknologi yang Digunakan
1. node js/express
2. mongoDB
3. haversine method (metode pengukuran jarak antar koordinat)

### Cara Penggunaan

AUTHOR : Yoga Rizya Pratama (yogarizya.p@gmail.com)
