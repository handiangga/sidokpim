import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Scale, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.username.trim() || !form.password) {
      await Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Username dan password wajib diisi.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#245a47",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: form.username.trim(),
        password: form.password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await Swal.fire({
        icon: "success",
        title: "Login berhasil",
        text: `Selamat datang, ${user.name}.`,
        showConfirmButton: false,
        timer: 1300,
        timerProgressBar: true,
      });

      navigate("/admin/kegiatan", { replace: true });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login gagal",
        text:
          error.response?.data?.message || "Tidak dapat terhubung ke server.",
        confirmButtonText: "Coba lagi",
        confirmButtonColor: "#245a47",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-cream lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative flex min-h-80 overflow-hidden bg-gradient-to-br from-primary-dark to-primary px-8 py-14 text-white sm:px-14 lg:min-h-screen lg:items-center lg:px-[clamp(50px,8vw,130px)]">
        <div className="relative z-10">
          <div className="mb-8 grid h-[76px] w-[76px] place-items-center rounded-full border border-gold/60 text-gold">
            <Scale size={42} strokeWidth={1.7} />
          </div>

          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-gold uppercase">
            Kejaksaan Negeri Sleman
          </p>

          <h1 className="max-w-xl font-serif text-[clamp(38px,5vw,64px)] leading-[1.08] font-medium">
            Sistem Informasi
            <span className="block text-[#f0d99f]">Dokumentasi Kegiatan</span>
          </h1>

          <div className="my-7 h-0.5 w-[70px] bg-gold" />

          <p className="max-w-lg text-[15px] leading-7 text-white/70">
            Media penyimpanan dan pencarian dokumentasi kegiatan Kejaksaan
            Negeri Sleman.
          </p>
        </div>

        <div className="absolute -right-40 -bottom-44 h-[430px] w-[430px] rounded-full border border-gold/20 shadow-[0_0_0_55px_rgba(217,184,108,0.04),0_0_0_110px_rgba(217,184,108,0.03)]" />
      </section>

      <section className="flex flex-col items-center justify-center px-5 py-10 sm:px-12">
        <div className="w-full max-w-[440px] rounded-2xl border border-[#ebe5d8] bg-white p-6 shadow-[0_22px_60px_rgba(39,67,53,0.10)] sm:p-11">
          <header className="mb-8">
            <span className="text-[11px] font-extrabold tracking-[0.18em] text-gold-dark">
              AKSES ADMINISTRATOR
            </span>

            <h2 className="mt-2 mb-2 font-serif text-3xl font-medium text-primary-dark">
              Selamat Datang
            </h2>

            <p className="text-sm leading-6 text-[#7b817d]">
              Masukkan akun administrator untuk melanjutkan.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="username"
              className="mb-2 block text-[13px] font-bold text-[#38473f]"
            >
              Username
            </label>

            <div className="mb-5 flex min-h-h-[52px] items-center gap-3 rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 text-[#8b958f] focus-within:border-primary focus-within:bg-white focus-within:text-primary focus-within:ring-4 focus-within:ring-primary/10">
              <UserRound size={19} />

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                autoComplete="username"
                className="min-w-0 flex-1 bg-transparent py-4 text-[#25342d] outline-none placeholder:text-[#a2a9a5]"
              />
            </div>

            <label
              htmlFor="password"
              className="mb-2 block text-[13px] font-bold text-[#38473f]"
            >
              Password
            </label>

            <div className="flex min-h-[52px] items-center gap-3 rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 text-[#8b958f] focus-within:border-primary focus-within:bg-white focus-within:text-primary focus-within:ring-4 focus-within:ring-primary/10">
              <LockKeyhole size={19} />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent py-4 text-[#25342d] outline-none placeholder:text-[#a2a9a5]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="cursor-pointer bg-transparent p-1 text-[#7d8982] hover:text-primary"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 min-h-[52px] w-full cursor-pointer rounded-lg bg-primary text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 block text-center text-[13px] text-[#557064] no-underline hover:text-gold-dark"
          >
            ← Kembali ke beranda
          </Link>
        </div>

        <p className="mt-6 text-xs text-[#969b98]">
          © 2026 Kejaksaan Negeri Sleman
        </p>
      </section>
    </main>
  );
}

export default Login;
