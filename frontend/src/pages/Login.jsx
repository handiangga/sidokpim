import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import { getErrorMessage } from "../utils/alerts";

const initialForm = {
  username: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const formComplete = Boolean(form.username.trim() && form.password);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formComplete) {
      await Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Username dan password wajib diisi.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#294f3e",
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
        text: `Selamat datang, ${user.name || "Administrator"}.`,
        showConfirmButton: false,
        timer: 1300,
        timerProgressBar: true,
      });

      navigate("/admin/kegiatan", { replace: true });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: getErrorMessage(
          error,
          "Username, password, atau koneksi server bermasalah.",
        ),
        confirmButtonText: "Coba lagi",
        confirmButtonColor: "#294f3e",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#faf8f2] lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative min-h-[240px] overflow-hidden sm:min-h-[310px] lg:min-h-screen">
        <img
          src="/images/gedung-kejari-sleman.jpg"
          alt="Gedung Kejaksaan Negeri Sleman"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/15 lg:bg-gradient-to-r lg:from-white/95 lg:via-white/70 lg:to-white/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5eb]/30 via-transparent to-white/20" />

        <div className="pointer-events-none absolute -right-28 -top-36 h-80 w-80 rounded-full border-[38px] border-[#315b49]/10 sm:h-[430px] sm:w-[430px] sm:border-[50px]" />

        <div className="pointer-events-none absolute -bottom-44 -left-36 h-[390px] w-[390px] rounded-full border-[42px] border-[#b68a2d]/10 sm:h-[500px] sm:w-[500px] sm:border-[55px]" />

        <div className="relative z-10 flex h-full min-h-[240px] items-center px-5 py-7 sm:min-h-[310px] sm:px-10 lg:min-h-screen lg:px-[clamp(50px,7vw,120px)] lg:py-16">
          <div className="max-w-[650px]">
            <div className="flex items-center gap-4 lg:block">
              <img
                src="/images/logo-kejaksaan.png"
                alt="Logo Kejaksaan Negeri Sleman"
                className="h-20 w-auto object-contain sm:h-24 lg:h-[125px]"
              />

              <div className="lg:mt-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#987323] sm:text-xs">
                  Kejaksaan Negeri Sleman
                </p>

                <h1 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.02em] text-[#173f32] sm:text-3xl lg:text-[46px] lg:leading-[1.12]">
                  <span className="block">Sistem Informasi</span>
                  <span className="block">Dokumentasi</span>
                  <span className="block text-[#9b792a]">
                    Kegiatan Pimpinan
                  </span>
                </h1>
              </div>
            </div>

            <div className="mt-6 hidden lg:block">
              <div className="h-0.5 w-16 bg-[#b68a2d]" />

              <p className="mt-5 text-base font-medium text-[#315b49]">
                Dokumentasi
                <span className="mx-2">•</span>
                Transparansi
                <span className="mx-2">•</span>
                Akuntabilitas
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-240px)] flex-col items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-310px)] sm:px-8 sm:py-10 lg:min-h-screen lg:px-12">
        <div className="w-full max-w-[500px] rounded-2xl border border-[#e8e2d6] bg-white/95 p-5 shadow-[0_22px_60px_rgba(39,67,53,0.10)] backdrop-blur-sm sm:p-8 lg:p-10">
          <header className="mb-7">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a67c24] sm:text-[11px]">
              Akses Administrator
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#173f32] sm:text-3xl">
              Selamat Datang
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7b817d]">
              Masukkan akun administrator untuk melanjutkan.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="username"
              className="mb-2 block text-[13px] font-bold text-[#38473f]"
            >
              Username
            </label>

            <div className="mb-5 flex min-h-[52px] items-center gap-3 rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 text-[#8b958f] transition focus-within:border-[#294f3e] focus-within:bg-white focus-within:text-[#294f3e] focus-within:ring-4 focus-within:ring-[#294f3e]/10">
              <UserRound size={19} className="shrink-0" aria-hidden="true" />

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                autoComplete="username"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#25342d] outline-none placeholder:text-[#a2a9a5] disabled:cursor-not-allowed"
              />
            </div>

            <label
              htmlFor="password"
              className="mb-2 block text-[13px] font-bold text-[#38473f]"
            >
              Password
            </label>

            <div className="flex min-h-[52px] items-center gap-3 rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 text-[#8b958f] transition focus-within:border-[#294f3e] focus-within:bg-white focus-within:text-[#294f3e] focus-within:ring-4 focus-within:ring-[#294f3e]/10">
              <LockKeyhole size={19} className="shrink-0" aria-hidden="true" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                autoComplete="current-password"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#25342d] outline-none placeholder:text-[#a2a9a5] disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={loading}
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-md bg-transparent text-[#7d8982] transition hover:bg-[#eceae3] hover:text-[#294f3e] disabled:cursor-not-allowed"
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
              className="mt-7 inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#294f3e] px-5 text-sm font-bold text-white transition hover:bg-[#173f32] focus:outline-none focus:ring-4 focus:ring-[#294f3e]/20 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 block text-center text-[13px] font-medium text-[#557064] no-underline transition hover:text-[#a67c24]"
          >
            ← Kembali ke beranda
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-[#969b98]">
          © {currentYear} Kejaksaan Negeri Sleman
        </p>
      </section>
    </main>
  );
}

export default Login;
