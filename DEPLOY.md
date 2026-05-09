# Deploy Guide — Cathrine Portfolio

## ✅ Rekomendasi: Vercel (GRATIS)

Vercel adalah platform yang dibuat oleh tim Next.js sendiri.
Untuk portfolio pribadi dengan traffic rendah: **$0/bulan selamanya**.

### Cara pindah ke Vercel (10 menit):

1. Buka https://vercel.com → Sign up dengan GitHub
2. Klik **"Add New Project"** → Import repo `catherine-ang-portofolio`
3. Di bagian **Environment Variables**, isi:
   ```
   NEXT_PUBLIC_SUPABASE_URL        = (dari .env.local)
   NEXT_PUBLIC_SUPABASE_ANON_KEY   = (dari .env.local)
   SUPABASE_SERVICE_ROLE_KEY       = (dari .env.local)
   RESEND_API_KEY                  = (dari .env.local)
   RESEND_FROM_EMAIL               = (dari .env.local)
   RESEND_TO_EMAIL                 = (dari .env.local)
   NEXT_PUBLIC_SITE_URL            = https://your-domain.vercel.app
   ```
4. Klik **Deploy** — selesai!

Setelah deploy, Railway bisa di-delete.

---

## Railway (jika tetap ingin pakai)

Konfigurasi sudah dioptimalkan di `railway.toml`.
Build menggunakan `output: standalone` yang menghemat memory ~40%.

Environment variables sama seperti di atas, set di Railway dashboard.

---

## Catatan ISR (Incremental Static Regeneration)

Halaman publik sekarang menggunakan cache:
- **Homepage** — cache 60 detik (update konten terlihat max 1 menit setelah admin save)
- **Project/Artwork detail pages** — cache 1 jam

Setelah update konten di admin, tunggu max 60 detik untuk homepage refresh.
Untuk force-refresh langsung, re-deploy dari Vercel/Railway dashboard.
