import { FolderTree, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    try {
      setLoading(true);

      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal memuat kategori",
        text:
          error.response?.data?.message ||
          "Tidak dapat mengambil data kategori.",
        confirmButtonColor: "#245a47",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd() {
    const result = await Swal.fire({
      title: "Tambah Kategori",
      text: "Masukkan nama kategori kegiatan.",
      input: "text",
      inputPlaceholder: "Contoh: Penerangan Hukum",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#245a47",
      cancelButtonColor: "#8a918d",
      reverseButtons: true,
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Nama kategori wajib diisi";
        }

        if (value.trim().length < 3) {
          return "Nama kategori minimal 3 karakter";
        }

        return undefined;
      },
    });

    if (!result.isConfirmed) return;

    try {
      await api.post("/categories", {
        name: result.value.trim(),
      });

      await Swal.fire({
        icon: "success",
        title: "Kategori ditambahkan",
        text: "Kategori baru berhasil disimpan.",
        showConfirmButton: false,
        timer: 1200,
      });

      fetchCategories();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan kategori.",
        confirmButtonColor: "#245a47",
      });
    }
  }

  async function handleEdit(category) {
    const result = await Swal.fire({
      title: "Edit Kategori",
      text: "Ubah nama kategori kegiatan.",
      input: "text",
      inputValue: category.name,
      showCancelButton: true,
      confirmButtonText: "Simpan Perubahan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#245a47",
      cancelButtonColor: "#8a918d",
      reverseButtons: true,
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Nama kategori wajib diisi";
        }

        if (value.trim().length < 3) {
          return "Nama kategori minimal 3 karakter";
        }

        return undefined;
      },
    });

    if (!result.isConfirmed) return;

    const updatedName = result.value.trim();

    if (updatedName === category.name) {
      return;
    }

    try {
      await api.put(`/categories/${category.id}`, {
        name: updatedName,
      });

      await Swal.fire({
        icon: "success",
        title: "Kategori diperbarui",
        text: "Perubahan kategori berhasil disimpan.",
        showConfirmButton: false,
        timer: 1200,
      });

      fetchCategories();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui kategori.",
        confirmButtonColor: "#245a47",
      });
    }
  }

  async function handleDelete(category) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus kategori?",
      html: `Kategori <strong>${category.name}</strong> akan dihapus.`,
      text: "Kategori yang masih digunakan oleh kegiatan tidak dapat dihapus.",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#b44343",
      cancelButtonColor: "#8a918d",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/categories/${category.id}`);

      await Swal.fire({
        icon: "success",
        title: "Kategori dihapus",
        text: "Kategori berhasil dihapus dari sistem.",
        showConfirmButton: false,
        timer: 1200,
      });

      fetchCategories();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Kategori tidak dapat dihapus",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus kategori.",
        confirmButtonColor: "#245a47",
      });
    }
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-extrabold tracking-[0.18em] text-gold-dark uppercase">
            Pengaturan Data
          </p>

          <h1 className="font-serif text-3xl font-medium text-primary-dark">
            Kelola Kategori
          </h1>

          <p className="mt-2 text-sm text-[#7c8580]">
            Atur kategori yang digunakan untuk mengelompokkan kegiatan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-[#e8e3d8] bg-white p-5 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <FolderTree size={23} />
          </div>

          <div>
            <p className="text-2xl font-bold text-primary-dark">
              {categories.length}
            </p>
            <p className="mt-1 text-xs text-[#838c87]">Total kategori</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-[#e8e3d8] bg-white p-5 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold/20 text-gold-dark">
            <Tag size={23} />
          </div>

          <div>
            <p className="text-sm font-bold text-primary-dark">
              Pengelompokan Kegiatan
            </p>
            <p className="mt-1 text-xs text-[#838c87]">
              Digunakan pada data dokumentasi
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e8e3d8] bg-white shadow-sm">
        <div className="border-b border-[#eeeae1] px-6 py-5">
          <h2 className="font-serif text-xl font-medium text-primary-dark">
            Daftar Kategori
          </h2>

          <p className="mt-1 text-sm text-[#8a928e]">
            Nama kategori tidak boleh sama.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead>
              <tr className="bg-[#faf9f5] text-[11px] tracking-wider text-[#77807b] uppercase">
                <th className="w-20 px-6 py-4 text-center font-bold">No.</th>
                <th className="px-6 py-4 font-bold">Nama Kategori</th>
                <th className="px-6 py-4 font-bold">Tanggal Dibuat</th>
                <th className="w-32 px-6 py-4 text-center font-bold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eeeae1]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                    <p className="text-sm text-[#7c8580]">Memuat kategori...</p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <FolderTree
                      size={42}
                      className="mx-auto mb-3 text-[#c7ccc9]"
                    />

                    <p className="font-semibold text-[#59645e]">
                      Belum ada kategori
                    </p>

                    <p className="mt-1 text-sm text-[#929995]">
                      Tambahkan kategori untuk mengelompokkan kegiatan.
                    </p>
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-[#fcfbf8]"
                  >
                    <td className="px-6 py-4 text-center text-sm text-[#8b928e]">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Tag size={17} />
                        </div>

                        <span className="font-semibold text-primary-dark">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#657069]">
                      {formatDate(category.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          title="Edit kategori"
                          onClick={() => handleEdit(category)}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-[#d9d4c8] bg-white text-primary hover:border-primary hover:bg-primary hover:text-white"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Hapus kategori"
                          onClick={() => handleDelete(category)}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-[#ead4d4] bg-white text-[#b44343] hover:border-[#b44343] hover:bg-[#b44343] hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Categories;
