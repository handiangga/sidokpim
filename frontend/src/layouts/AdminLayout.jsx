import { CalendarDays, FolderTree, LogOut, Menu, Scale, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const navigation = [
  {
    label: "Data Kegiatan",
    path: "/admin/kegiatan",
    icon: CalendarDays,
  },
  {
    label: "Kelola Kategori",
    path: "/admin/kategori",
    icon: FolderTree,
  },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function handleLogout() {
    const result = await Swal.fire({
      icon: "question",
      title: "Keluar dari sistem?",
      text: "Anda harus login kembali untuk mengakses halaman admin.",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#245a47",
      cancelButtonColor: "#8a918d",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f7f6f1]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/35 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-primary-dark text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex min-h-24 items-center gap-4 border-b border-white/10 px-6">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/60 text-gold">
            <Scale size={27} />
          </div>

          <div>
            <p className="font-serif text-lg leading-tight">
              Dokumentasi Kegiatan
            </p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.14em] text-gold uppercase">
              Kejari Sleman
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white/70 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
            Menu Utama
          </p>

          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm no-underline ${
                  isActive
                    ? "bg-gold text-primary-dark shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span className="font-semibold">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-lg bg-white/5 px-4 py-3">
            <p className="text-xs text-white/45">Masuk sebagai</p>
            <p className="mt-1 truncate text-sm font-semibold">
              {user.name || "Administrator"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/70 hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={19} />
            <span className="font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex min-h-20 items-center border-b border-[#e8e3d8] bg-white/90 px-5 backdrop-blur-sm sm:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mr-4 cursor-pointer text-primary-dark lg:hidden"
          >
            <Menu size={25} />
          </button>

          <div>
            <p className="text-sm font-semibold text-primary-dark">
              Sistem Informasi Dokumentasi Kegiatan
            </p>
            <p className="mt-1 text-xs text-[#89908c]">
              Kejaksaan Negeri Sleman
            </p>
          </div>

          <div className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-white">
            {(user.name || "A").charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
