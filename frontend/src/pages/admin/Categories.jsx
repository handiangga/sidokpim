import { FolderTree, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";
import { getErrorMessage, showError } from "../../utils/alerts";

const initialModal = {
  open: false,
  mode: "add",
  category: null,
};

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function CategoryActions({ category, onEdit, onDelete, mobile = false }) {
  return (
    <div className={`flex gap-2 ${mobile ? "w-full" : "justify-center"}`}>
      <button
        type="button"
        title="Edit kategori"
        aria-label={`Edit kategori ${category.name}`}
        onClick={() => onEdit(category)}
        className={`
          inline-flex min-h-10 cursor-pointer items-center
          justify-center gap-2 rounded-lg border
          border-[#d9d4c8] bg-white font-bold
          text-[#294f3e] transition
          hover:border-[#294f3e] hover:bg-[#294f3e]
          hover:text-white
          ${mobile ? "flex-1 px-4 text-sm" : "h-10 w-10"}
        `}
      >
        <Pencil size={16} />
        {mobile && <span>Edit</span>}
      </button>

      <button
        type="button"
        title="Hapus kategori"
        aria-label={`Hapus kategori ${category.name}`}
        onClick={() => onDelete(category)}
        className={`
          inline-flex min-h-10 cursor-pointer items-center
          justify-center gap-2 rounded-lg border
          border-[#ead4d4] bg-white font-bold
          text-[#b44343] transition
          hover:border-[#b44343] hover:bg-[#b44343]
          hover:text-white
          ${mobile ? "flex-1 px-4 text-sm" : "h-10 w-10"}
        `}
      >
        <Trash2 size={16} />
        {mobile && <span>Hapus</span>}
      </button>
    </div>
  );
}

function CategoryModal({
  modal,
  name,
  error,
  submitting,
  onNameChange,
  onClose,
  onSubmit,
}) {
  const inputRef = useRef(null);
  const isEdit = modal.mode === "edit";

  useEffect(() => {
    if (!modal.open) return undefined;

    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal.open, submitting, onClose]);

  if (!modal.open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/45 px-4 py-8 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-[#e5dfd2] bg-white shadow-[0_24px_80px_rgba(21,45,35,0.24)]"
      >
        <div className="flex items-start gap-4 border-b border-[#eee9df] px-5 py-5 sm:px-6">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#294f3e]/10 text-[#294f3e]">
            {isEdit ? <Pencil size={20} /> : <Plus size={21} />}
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="category-modal-title"
              className="text-xl font-extrabold text-[#173f32]"
            >
              {isEdit ? "Edit Kategori" : "Tambah Kategori"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#7c8580]">
              {isEdit
                ? "Perbarui nama kategori kegiatan."
                : "Tambahkan kategori baru untuk mengelompokkan kegiatan."}
            </p>
          </div>

          <button
            type="button"
            aria-label="Tutup modal"
            onClick={onClose}
            disabled={submitting}
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-lg text-[#7e8883] transition hover:bg-[#f0eee8] hover:text-[#294f3e] disabled:cursor-not-allowed"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="px-5 py-6 sm:px-6">
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-bold text-[#284138]"
            >
              Nama Kategori
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              ref={inputRef}
              id="category-name"
              name="category_name"
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Contoh: Penerangan Hukum"
              maxLength={100}
              disabled={submitting}
              className={`
                min-h-12 w-full rounded-lg border
                bg-[#fbfaf7] px-4 text-sm text-[#27362f]
                outline-none transition placeholder:text-[#9da5a1]
                focus:bg-white focus:ring-4
                disabled:cursor-not-allowed disabled:opacity-60
                ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                    : "border-[#ddd9cf] focus:border-[#294f3e] focus:ring-[#294f3e]/10"
                }
              `}
            />

            <div className="mt-2 flex items-start justify-between gap-4">
              <p
                className={`text-xs ${
                  error ? "text-red-500" : "text-[#8a928e]"
                }`}
              >
                {error || "Minimal 3 karakter dan tidak boleh sama."}
              </p>

              <p className="shrink-0 text-xs text-[#a1a8a4]">
                {name.length}/100
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#eee9df] bg-[#fcfbf8] px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="min-h-12 w-full cursor-pointer rounded-lg border border-[#294f3e] bg-white px-6 text-sm font-bold text-[#294f3e] transition hover:bg-[#f1f4f2] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#294f3e] px-6 text-sm font-bold text-white transition hover:bg-[#173f32] focus:outline-none focus:ring-4 focus:ring-[#294f3e]/20 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Menyimpan...
                </>
              ) : (
                <>
                  {isEdit ? <Pencil size={17} /> : <Plus size={18} />}

                  {isEdit ? "Simpan Perubahan" : "Simpan Kategori"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState(initialModal);
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState("");

  const fetchCategories = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await api.get("/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      showError(
        "Gagal memuat kategori",
        getErrorMessage(error, "Tidak dapat mengambil data kategori."),
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  /*
   * Pemuatan pertama ditulis langsung di dalam effect.
   * Ini menghindari error react-hooks/set-state-in-effect.
   */
  useEffect(() => {
    let active = true;

    async function loadInitialCategories() {
      try {
        const response = await api.get("/categories");

        if (active) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        if (active) {
          showError(
            "Gagal memuat kategori",
            getErrorMessage(error, "Tidak dapat mengambil data kategori."),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitialCategories();

    return () => {
      active = false;
    };
  }, []);

  const closeModal = useCallback(() => {
    if (submitting) return;

    setModal(initialModal);
    setCategoryName("");
    setFormError("");
  }, [submitting]);

  function openAddModal() {
    setCategoryName("");
    setFormError("");

    setModal({
      open: true,
      mode: "add",
      category: null,
    });
  }

  function openEditModal(category) {
    setCategoryName(category.name);
    setFormError("");

    setModal({
      open: true,
      mode: "edit",
      category,
    });
  }

  function handleNameChange(event) {
    setCategoryName(event.target.value);

    if (formError) {
      setFormError("");
    }
  }

  function validateCategoryName() {
    const normalizedName = categoryName.trim();

    if (!normalizedName) {
      setFormError("Nama kategori wajib diisi.");
      return false;
    }

    if (normalizedName.length < 3) {
      setFormError("Nama kategori minimal 3 karakter.");
      return false;
    }

    const duplicate = categories.some((category) => {
      const sameName =
        category.name.trim().toLowerCase() === normalizedName.toLowerCase();

      const currentCategory =
        modal.mode === "edit" && category.id === modal.category?.id;

      return sameName && !currentCategory;
    });

    if (duplicate) {
      setFormError("Nama kategori sudah digunakan.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting || !validateCategoryName()) {
      return;
    }

    const name = categoryName.trim();
    const isEdit = modal.mode === "edit";

    if (
      isEdit &&
      name.toLowerCase() === modal.category?.name.trim().toLowerCase()
    ) {
      closeModal();
      return;
    }

    try {
      setSubmitting(true);

      if (isEdit) {
        await api.put(`/categories/${modal.category.id}`, { name });
      } else {
        await api.post("/categories", { name });
      }

      /*
       * Tutup modal secara langsung setelah request berhasil.
       * Jangan memanggil closeModal saat submitting masih true.
       */
      setSubmitting(false);
      setModal(initialModal);
      setCategoryName("");
      setFormError("");

      await fetchCategories(false);

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Kategori diperbarui" : "Kategori ditambahkan",
        text: isEdit
          ? "Perubahan kategori berhasil disimpan."
          : "Kategori baru berhasil disimpan.",
        showConfirmButton: false,
        timer: 1300,
        timerProgressBar: true,
      });
    } catch (error) {
      showError(
        isEdit ? "Gagal memperbarui" : "Gagal menambahkan",
        getErrorMessage(error, "Terjadi kesalahan saat menyimpan kategori."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus kategori?",
      text: `"${category.name}" akan dihapus. Kategori yang masih digunakan oleh kegiatan tidak dapat dihapus.`,
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

      await fetchCategories(false);

      await Swal.fire({
        icon: "success",
        title: "Kategori dihapus",
        text: "Kategori berhasil dihapus dari sistem.",
        showConfirmButton: false,
        timer: 1300,
        timerProgressBar: true,
      });
    } catch (error) {
      showError(
        "Kategori tidak dapat dihapus",
        getErrorMessage(
          error,
          "Kategori mungkin masih digunakan oleh data kegiatan.",
        ),
      );
    }
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a67c24] sm:text-[11px]">
              Pengaturan Data
            </p>

            <h1 className="text-2xl font-extrabold text-[#173f32] sm:text-3xl">
              Kategori
            </h1>

            <p className="mt-2 text-sm text-[#7c8580]">
              Atur kategori yang digunakan untuk mengelompokkan kegiatan.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#294f3e] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#173f32] sm:w-auto"
          >
            <Plus size={18} />
            Tambah Kategori
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-[#e8e3d8] bg-white p-5 shadow-sm">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#294f3e]/10 text-[#294f3e]">
              <FolderTree size={23} />
            </div>

            <div>
              <p className="text-2xl font-extrabold text-[#173f32]">
                {loading ? "—" : categories.length}
              </p>

              <p className="mt-1 text-xs text-[#838c87]">Total kategori</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#e8e3d8] bg-white p-5 shadow-sm">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#b68a2d]/15 text-[#a67c24]">
              <Tag size={23} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#173f32]">
                Pengelompokan Kegiatan
              </p>

              <p className="mt-1 text-xs text-[#838c87]">
                Digunakan pada data dokumentasi
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e8e3d8] bg-white shadow-sm">
          <div className="border-b border-[#eeeae1] px-4 py-5 sm:px-6">
            <h2 className="text-lg font-extrabold text-[#173f32] sm:text-xl">
              Daftar Kategori
            </h2>

            <p className="mt-1 text-sm text-[#8a928e]">
              Nama kategori tidak boleh sama.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#294f3e]/20 border-t-[#294f3e]" />

              <p className="text-sm text-[#7c8580]">Memuat kategori...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <FolderTree size={44} className="mx-auto mb-3 text-[#c7ccc9]" />

              <p className="font-bold text-[#59645e]">Belum ada kategori</p>

              <p className="mt-1 text-sm text-[#929995]">
                Tambahkan kategori untuk mengelompokkan kegiatan.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#294f3e] px-5 text-sm font-bold text-white"
              >
                <Plus size={17} />
                Tambah Kategori
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:hidden">
                {categories.map((category, index) => (
                  <article
                    key={category.id}
                    className="rounded-xl border border-[#e8e3d8] bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#294f3e]/10 text-[#294f3e]">
                        <Tag size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#a67c24]">
                          Kategori {index + 1}
                        </p>

                        <h2 className="mt-1 break-words font-extrabold text-[#173f32]">
                          {category.name}
                        </h2>

                        <p className="mt-2 text-xs text-[#7d8782]">
                          Dibuat {formatDate(category.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#eeeae1] pt-4">
                      <CategoryActions
                        category={category}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        mobile
                      />
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[650px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#faf9f5] text-[11px] uppercase tracking-wider text-[#77807b]">
                      <th className="w-20 px-6 py-4 text-center font-bold">
                        No.
                      </th>

                      <th className="px-6 py-4 font-bold">Nama Kategori</th>

                      <th className="px-6 py-4 font-bold">Tanggal Dibuat</th>

                      <th className="w-32 px-6 py-4 text-center font-bold">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#eeeae1]">
                    {categories.map((category, index) => (
                      <tr
                        key={category.id}
                        className="transition hover:bg-[#fcfbf8]"
                      >
                        <td className="px-6 py-4 text-center text-sm text-[#8b928e]">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#294f3e]/10 text-[#294f3e]">
                              <Tag size={17} />
                            </div>

                            <span className="font-bold text-[#173f32]">
                              {category.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#657069]">
                          {formatDate(category.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <CategoryActions
                            category={category}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      <CategoryModal
        modal={modal}
        name={categoryName}
        error={formError}
        submitting={submitting}
        onNameChange={handleNameChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default Categories;
