# Dokumentasi Deployment KIRA ke Google Cloud Run

Dokumen ini menjelaskan langkah-langkah untuk melakukan deployment aplikasi KIRA (Next.js) ke Google Cloud Run menggunakan Docker.

## Prasyarat

1. **Google Cloud Account**: Pastikan Anda memiliki akun Google Cloud yang aktif.
2. **Google Cloud SDK (gcloud CLI)**: Terinstal di mesin lokal Anda (Panduan instalasi Fedora ada di bawah).
3. **Project ID**: ID Project Google Cloud Anda (contoh: `kira-production-123`).
4. **Billing**: Pastikan billing sudah diaktifkan pada project Anda.

## Instalasi Google Cloud CLI (Fedora)

Jika Anda menggunakan Fedora, ikuti langkah berikut untuk menginstal `gcloud CLI`:

1. Tambahkan repository Google Cloud SDK:
```bash
sudo tee -a /etc/yum.repos.d/google-cloud-sdk.repo << EOM
[google-cloud-sdk]
name=Google Cloud SDK
baseurl=https://packages.cloud.google.com/yum/repos/cloud-sdk-el9-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOM
```

2. Instal SDK:
```bash
sudo dnf install google-cloud-sdk
```

3. Inisialisasi gcloud:
```bash
gcloud init
```
Ikuti petunjuk di layar untuk login dan memilih project Anda.

---

## Persiapan di Google Cloud Console

Jika Anda lebih suka menggunakan antarmuka web (Console), berikut adalah hal-hal yang harus disiapkan:

### 1. Buat Project Baru
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Klik dropdown project di bagian atas dan pilih **New Project**.
3. Beri nama project (misal: `kira-app`) dan catat **Project ID**-nya.

### 2. Aktifkan API secara Manual
Buka menu **APIs & Services > Library**, cari dan aktifkan API berikut:
- **Cloud Run API**
- **Artifact Registry API**
- **Cloud Build API**
- **Secret Manager API**

### 3. Buat Artifact Registry (Dashboard)
1. Cari **Artifact Registry** di kolom pencarian Console.
2. Klik **+ CREATE REPOSITORY**.
3. Nama: `kira-repo`.
4. Format: **Docker**.
5. Region: `asia-southeast2` (Jakarta) atau region pilihan Anda.
6. Klik **Create**.

### 4. Alternatif: Gunakan Cloud Shell
Jika Anda tidak ingin menginstal apapun secara lokal, Anda bisa menggunakan **Cloud Shell** (ikon terminal `>_` di pojok kanan atas Console). Cloud Shell sudah terinstal `gcloud`, `docker`, dan `git`.


---

## Langkah-langkah Deployment (Manual)

### 1. Konfigurasi Autentikasi Docker
```bash
gcloud auth configure-docker asia-southeast2-docker.pkg.dev
```

### 2. Build dan Push Docker Image
Gunakan Cloud Build dengan file `cloudbuild.yaml` untuk menyuntikkan variabel environment saat proses build berlangsung.

**Jalankan perintah build:**
```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_DATABASE_URL="[ISI_URL_DATABASE]",\
  _DIRECT_URL="[ISI_DIRECT_URL]",\
  _GEMINI_API_KEY="[ISI_GEMINI_API_KEY]",\
  _CLERK_SECRET_KEY="[ISI_CLERK_SECRET_KEY]",\
  _NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="[ISI_CLERK_PUB_KEY]"
```

### 3. Deploy ke Cloud Run
Setelah build selesai, jalankan perintah ini untuk melakukan deployment:

```bash
gcloud run deploy kira-app \
    --image asia-southeast2-docker.pkg.dev/[PROJECT_ID]/kira-repo/kira-app:latest \
    --platform managed \
    --region asia-southeast2 \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 1 \
    --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in,NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up"
```


### 4. Cara Mendapatkan URL Akses
Setelah perintah deploy selesai, URL publik akan muncul di output terminal pada baris `Service URL`.

Jika Anda ingin mengeceknya kembali nanti, gunakan perintah:
```bash
gcloud run services list
```
Atau lihat di Dashboard [Cloud Run Console](https://console.cloud.google.com/run).


---

## Pengelolaan Environment Variables

Sangat disarankan untuk menggunakan **Secret Manager** untuk variabel sensitif (seperti `DATABASE_URL`, `CLERK_SECRET_KEY`, dll).

### Menambahkan Secret
1. Masuk ke Google Cloud Console > Secret Manager.
2. Buat secret baru (misal: `DATABASE_URL`).
3. Berikan akses ke Service Account Cloud Run untuk membaca secret tersebut.

### Menghubungkan Secret ke Cloud Run
Saat deploy, gunakan flag `--set-secrets`:
```bash
gcloud run deploy kira-app \
    --image [IMAGE_URL] \
    --set-secrets="DATABASE_URL=DATABASE_URL:latest,CLERK_SECRET_KEY=CLERK_SECRET_KEY:latest"
```

---

## Daftar Environment Variables yang Dibutuhkan

Berikut adalah variabel yang harus dikonfigurasi di Cloud Run:

| Nama Variabel | Sumber | Deskripsi |
| :--- | :--- | :--- |
| `DATABASE_URL` | Secret | Koneksi Database Prisma |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Env/Secret | Clerk Auth Key |
| `CLERK_SECRET_KEY` | Secret | Clerk Secret Key |
| `GEMINI_API_KEY` | Secret | Google AI API Key |
| `NEXT_PUBLIC_APP_URL` | Env | URL Production (misal: https://kira.app) |

---

## Tips Tambahan

1. **Prisma Migration**: Karena Cloud Run bersifat stateless, Anda harus menjalankan `npx prisma db push` atau `migrate` secara manual atau melalui CI/CD sebelum deployment.
2. **Cold Start**: Jika aplikasi jarang diakses, request pertama mungkin agak lambat. Anda bisa mengatur `--min-instances 1` untuk menghindari cold start (akan dikenakan biaya tambahan).
3. **Memory & CPU**: Aplikasi Next.js dengan AI processing mungkin butuh resource lebih. Gunakan minimal 2GiB RAM:
   ```bash
   gcloud run services update kira-app --memory 2Gi --cpu 2
   ```

---

---

## Automasi dengan GitHub Actions (CI/CD)

Untuk otomatisasi deployment setiap kali ada perubahan kode, gunakan GitHub Actions.

### 1. Buat file `.github/workflows/deploy.yml`
```yaml
name: Deploy to Cloud Run
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - id: 'auth'
        uses: 'google-github-actions/auth@v2'
        with:
          credentials_json: '${{ secrets.GCP_SA_KEY }}'
      - uses: 'google-github-actions/setup-gcloud@v2'

      # Prisma Migration
      - run: npm install && npx prisma db push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      # Build & Deploy
      - run: |
          gcloud auth configure-docker asia-southeast2-docker.pkg.dev
          docker build -t asia-southeast2-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/kira-repo/kira-app:latest .
          docker push asia-southeast2-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/kira-repo/kira-app:latest
          gcloud run deploy kira-app \
            --image asia-southeast2-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/kira-repo/kira-app:latest \
            --region asia-southeast2 \
            --memory 2Gi --cpu 2 --min-instances 1 \
            --set-secrets="DATABASE_URL=DATABASE_URL:latest"
```

### 2. Persiapan di GitHub Secrets

Tambahkan variabel berikut di **Settings > Secrets and variables > Actions**:

| Name | Value | Deskripsi |
| :--- | :--- | :--- |
| `GCP_PROJECT_ID` | `[ID_PROJECT_ANDA]` | ID Project Google Cloud |
| `GCP_SA_KEY` | `[ISI_JSON_KEY]` | Seluruh isi file JSON dari Service Account |
| `DATABASE_URL` | `[URL_DATABASE]` | Connection string untuk Prisma |
| `CLERK_PUB_KEY` | `[CLERK_PUB_KEY]` | Clerk Publishable Key |

---

## Langkah Detail Setup (Untuk Pemula)

### A. Membuat Service Account di GCP
1. Buka [Halaman Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Klik **+ CREATE SERVICE ACCOUNT**.
3. Beri nama (misal: `github-actions-deployer`).
4. **Berikan Roles**: Tambahkan role berikut:
   - `Cloud Run Admin`
   - `Artifact Registry Administrator`
   - `Storage Admin`
   - `Service Account User`
   - `Secret Manager Accessor`
5. Setelah selesai, klik email Service Account tersebut > tab **KEYS** > **ADD KEY** > **Create new key** > **JSON**.
6. Simpan file JSON yang terdownload, copy isinya untuk dimasukkan ke GitHub Secret `GCP_SA_KEY`.

### B. Menyiapkan Secret Manager
Agar variabel sensitif aman, gunakan Secret Manager:
1. Buka [Secret Manager](https://console.cloud.google.com/security/secret-manager).
2. Buat secret dengan nama `DATABASE_URL` dan `CLERK_SECRET_KEY`.
3. Masukkan nilai yang sesuai di masing-masing secret.

---

*Dokumentasi ini dibuat secara otomatis untuk membantu proses deployment KIRA.*


