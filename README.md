# CinemaApp - Modern Video Streaming Platform

CinemaApp - bu [IceSoft Team](https://t.me/ICESOFT_TEAM) tomonidan ishlab chiqilgan, zamonaviy va premium dizaynga ega video oqim platformasi. Ushbu platforma foydalanuvchilarga kinolar tomosha qilish, sharhlar qoldirish, reyting berish va premium obunalar orqali eksklyuziv kontentdan bahramand bo'lish imkoniyatini beradi.

## 🚀 Xususiyatlari

-   **Premium Dizayn**: Glassmorphism va zamonaviy UI/UX elementlari bilan boyitilgan interfeys.
-   **Obuna Tizimi**: PayX to'lov tizimi integratsiyasi orqali premium rejalarga obuna bo'lish.
-   **Video Yuklash va Transkodlash**: Katta hajmdagi videolarni qismlarga bo'lib (chunk) yuklash va FFmpeg yordamida avtomatik ravishda turli sifatlarda tahrirlash (transcoding).
-   **Admin Paneli**: To'liq nazorat - kinolar, kategoriyalar, foydalanuvchilar, sharhlar va reklamalarni boshqarish.
-   **Reklama Tizimi**: Sayt bo'ylab reklamalarni ko'rsatish boshqaruvi (Premium foydalanuvchilar uchun reklamalar avtomatik yashiriladi).
-   **Reyting va Izohlar**: Har bir film uchun foydalanuvchilar tomonidan qoldirilgan fikrlar va yulduzli reytinglar.
-   **O'zbek Tili Support**: Butun platforma o'zbek tiliga to'liq mahalliylashtirilgan.

## 🛠 Texnologiyalar

-   **Backend**: Laravel 12+
-   **Frontend**: React + Inertia.js
-   **Styling**: Custom CSS (Vanilla) + Tailwind CSS
-   **Video Processing**: FFmpeg (laravel-ffmpeg)
-   **Payment**: PayX API
-   **Icons**: Lucide React
-   **Player**: Plyr

## 📋 Talablar

Saytni ishga tushirish uchun serverda quyidagi texnologiyalar o'rnatilgan bo'lishi lozim:

-   **PHP**: 8.2 yoki undan yuqori
-   **MySQL/MariaDB**: 8.0+
-   **Node.js & NPM**: 18+ yoki so'nggi LTS
-   **FFmpeg**: Video transkodlash uchun zarur
-   **Redis**: Navbatlar (Job Queue) bilan ishlash uchun tavsiya etiladi

## ⚙️ O'rnatish (Lokal va Serverda)

### 1. Loyihani yuklab olish
```bash
git clone <repository_url>
cd cinema-app
```

### 2. Backend sozlamalari
```bash
composer install
cp .env.example .env
php artisan key:generate
```

`.env` faylida ma'lumotlar bazasi va PayX sozlamalarini kiriting:
```env
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

PAYX_TOKEN=your_payx_token
```

### 3. Ma'lumotlar bazasini sozlash
```bash
php artisan migrate --seed
```

### 4. Frontend sozlamalari
```bash
npm install
npm run build
```

### 5. Saqlash joyini ommaviylashtirish
Posternlar va videolarni ko'rsatish uchun:
```bash
php artisan storage:link
```

## 🚢 Serverga Joylashtirish (Deployment)

Loyihani umumiy hosting (cPanel) yoki VPS (Nginx) ga quyidagi bosqichlar orqali joylashtirish mumkin:

### VPS (Ubuntu + Nginx) uchun:
1.  Serverga PHP, MySQL, Nginx va FFmpeg o'rnating.
2.  Loyihani `/var/www/html` ga yuklang.
3.  `storage` va `bootstrap/cache` papkalariga yozish huquqini bering:
    ```bash
    sudo chown -R www-data:www-data storage bootstrap/cache
    sudo chmod -R 775 storage bootstrap/cache
    ```
4.  Nginx konfgiuratsiyasida `root` ni `public` papkasiga yo'naltiring.
5.  Video transkodlash fon rejimida ishlashi uchun **Supervisor** o'rnating va quyidagi commandni sozlang:
    ```bash
    php artisan queue:work --tries=3
    ```

## 📜 Buyruqlar

-   `php artisan serve` - Lokal development serverini boshlash.
-   `npm run dev` - Frontendni rivojlantirish rejimi.
-   `php artisan queue:work` - Navbatdagi ishlarni (masalan, video transkodlash) bajarish.

---
© 2026 [IceSoft Team](https://t.me/ICESOFT_TEAM). Barcha huquqlar himoyalangan.
