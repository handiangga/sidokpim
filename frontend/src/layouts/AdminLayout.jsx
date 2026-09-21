import { CalendarDays, FolderTree, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const navigation = [
  {
    label: "Data Kegiatan",
    path: "/admin/kegiatan",
    icon: CalendarDays,
  },
  {
    label: "Kategori",
    path: "/admin/kategori",
    icon: FolderTree,
  },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getStoredUser();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  async function handleLogout() {
    const result = await Swal.fire({
      icon: "question",
      title: "Keluar dari sistem?",
      text: "Anda harus login kembali untuk mengakses halaman administrator.",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#294f3e",
      cancelButtonColor: "#8a918d",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }

  const userName = user.name || "Administrator";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f7f4]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col
          overflow-hidden border-r border-[#e7e2d7] bg-[#fbfaf6]
          shadow-xl transition-transform duration-300 ease-out
          lg:w-[260px] lg:translate-x-0 lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative flex min-h-[170px] flex-col items-center justify-center border-b border-[#e7e2d7] px-6 py-5 text-center">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-[#53615a] transition hover:bg-[#eeeae0] lg:hidden"
          >
            <X size={22} />
          </button>

          <img
            src="/images/logo-kejaksaan.png"
            alt="Logo Kejaksaan Negeri Sleman"
            className="h-[86px] w-auto object-contain"
          />

          <p className="mt-3 text-xs font-extrabold leading-5 tracking-[0.08em] text-[#1c2822]">
            KEJAKSAAN NEGERI
            <br />
            SLEMAN
          </p>
        </div>

        <nav className="relative z-10 flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9a927e]">
            Menu Administrator
          </p>

          <div className="space-y-2">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `
                    flex min-h-12 items-center gap-3 rounded-xl
                    px-4 py-3 text-sm font-semibold no-underline
                    transition
                    ${
                      isActive
                        ? "bg-[#eee8d8] text-[#66531d] shadow-sm"
                        : "text-[#4f5a55] hover:bg-[#f0eee7] hover:text-[#294f3e]"
                    }
                  `
                }
              >
                <Icon size={20} strokeWidth={1.9} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 overflow-hidden opacity-[0.07]">
          <img
            src="/images/gedung-kejari-sleman.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fbfaf6] via-transparent to-[#fbfaf6]/30" />
        </div>

        <div className="relative z-10 border-t border-[#e7e2d7] bg-[#fbfaf6]/90 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-[#e8e3d8] bg-white/80 px-3 py-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#294f3e] text-sm font-bold text-white">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#1d2923]">
                {userName}
              </p>

              <p className="mt-0.5 text-xs text-[#89908c]">Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dfd8ca] bg-white px-4 text-sm font-bold text-[#59635e] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex min-h-[72px] items-center border-b border-[#e7e2d7] bg-white/90 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Buka menu navigasi"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            className="mr-3 grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-[#e4e0d7] bg-white text-[#294f3e] transition hover:bg-[#f4f1e9] lg:hidden"
          >
            <Menu size={23} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-[#1b2721] sm:text-base">
              Sistem Informasi Dokumentasi Kegiatan
            </p>

            <p className="mt-1 hidden text-xs text-[#89908c] sm:block">
              Kejaksaan Negeri Sleman
            </p>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-40 truncate text-sm font-bold text-[#26332d]">
                {userName}
              </p>

              <p className="mt-0.5 text-xs text-[#89908c]">Administrator</p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#294f3e] text-sm font-bold text-white shadow-sm">
              {initial}
            </div>
          </div>
        </header>

        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
