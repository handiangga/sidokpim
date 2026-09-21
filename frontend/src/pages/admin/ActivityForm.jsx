import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  ImagePlus,
  Link as LinkIcon,
  MapPin,
  Save,
  Tag,
  Type,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const FILE_URL = import.meta.env.VITE_FILE_URL;

const initialForm = {
  category_id: "",
  date: "",
  title: "",
  location: "",
  drive_url: "",
};

function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const categoryRequest = api.get("/categories");

        if (isEdit) {
          const [categoryResponse, activityResponse] = await Promise.all([
            categoryRequest,
            api.get(`/activities/${id}`),
          ]);

          setCategories(categoryResponse.data.data);

          const activity = activityResponse.data.data;

          setForm({
            category_id: String(activity.category_id),
            date: activity.date || "",
            title: activity.title || "",
            location: activity.location || "",
            drive_url: activity.drive_url || "",
          });

          if (activity.cover_image) {
            setCoverPreview(`${FILE_URL}${activity.cover_image}`);
          }
        } else {
          const categoryResponse = await categoryRequest;
          setCategories(categoryResponse.data.data);
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal memuat data",
          text:
            error.response?.data?.message ||
            "Tidak dapat mengambil data dari server.",
          confirmButtonColor: "#245a47",
        });

        if (isEdit) {
          navigate("/admin/kegiatan", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [id, isEdit, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleCoverChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      await Swal.fire({
        icon: "warning",
        title: "Format foto tidak didukung",
        text: "Gunakan foto berformat JPG, PNG, atau WEBP.",
        confirmButtonColor: "#245a47",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      await Swal.fire({
        icon: "warning",
        title: "Ukuran foto terlalu besar",
        text: "Ukuran maksimal foto cover adalah 5 MB.",
        confirmButtonColor: "#245a47",
      });

      event.target.value = "";
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function removeSelectedCover() {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(null);
    setCoverPreview("");

    const input = document.getElementById("cover_image");
    if (input) input.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const requiredFields = [
      form.category_id,
      form.date,
      form.title.trim(),
      form.location.trim(),
      form.drive_url.trim(),
    ];

    if (requiredFields.some((value) => !value)) {
      await Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Lengkapi seluruh data kegiatan yang wajib diisi.",
        confirmButtonColor: "#245a47",
      });

      return;
    }

    try {
      new URL(form.drive_url);
    } catch {
      await Swal.fire({
        icon: "warning",
        title: "Tautan tidak valid",
        text: "Masukkan tautan dokumentasi Google Drive yang benar.",
        confirmButtonColor: "#245a47",
      });

      return;
    }

    const formData = new FormData();

    formData.append("category_id", form.category_id);
    formData.append("date", form.date);
    formData.append("title", form.title.trim());
    formData.append("location", form.location.trim());
    formData.append("drive_url", form.drive_url.trim());

    if (coverFile) {
      formData.append("cover_image", coverFile);
    }

    try {
      setSubmitting(true);

      if (isEdit) {
        await api.put(`/activities/${id}`, formData);
      } else {
        await api.post("/activities", formData);
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Perubahan disimpan" : "Kegiatan ditambahkan",
        text: isEdit
          ? "Data kegiatan berhasil diperbarui."
          : "Data kegiatan baru berhasil disimpan.",
        showConfirmButton: false,
        timer: 1400,
        timerProgressBar: true,
      });

      navigate("/admin/kegiatan", { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan kegiatan.",
        confirmButtonColor: "#245a47",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-[#7c8580]">Memuat data kegiatan...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 py-3 text-sm text-[#27362f] outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10";

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-7 flex items-start gap-4">
        <Link
          to="/admin/kegiatan"
          className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#ddd9cf] bg-white text-primary no-underline hover:border-primary hover:bg-primary hover:text-white"
        >
          <ArrowLeft size={19} />
        </Link>

        <div>
          <p className="mb-2 text-[11px] font-extrabold tracking-[0.18em] text-gold-dark uppercase">
            Pengelolaan Dokumentasi
          </p>

          <h1 className="font-serif text-3xl font-medium text-primary-dark">
            {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"}
          </h1>

          <p className="mt-2 text-sm text-[#7c8580]">
            {isEdit
              ? "Perbarui metadata dan dokumentasi kegiatan."
              : "Tambahkan dokumentasi kegiatan baru ke dalam sistem."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-[#e8e3d8] bg-white shadow-sm"
      >
        <div className="border-b border-[#eeeae1] px-6 py-5 sm:px-8">
          <h2 className="font-serif text-xl font-medium text-primary-dark">
            Informasi Kegiatan
          </h2>

          <p className="mt-1 text-sm text-[#8a928e]">
            Kolom bertanda bintang wajib diisi.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#38473f]"
            >
              <CalendarDays size={16} className="text-gold-dark" />
              Tanggal Kegiatan <span className="text-red-500">*</span>
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="category_id"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#38473f]"
            >
              <Tag size={16} className="text-gold-dark" />
              Kategori <span className="text-red-500">*</span>
            </label>

            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Pilih kategori</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#38473f]"
            >
              <Type size={16} className="text-gold-dark" />
              Nama Kegiatan <span className="text-red-500">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan nama kegiatan"
              className={inputClass}
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="location"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#38473f]"
            >
              <MapPin size={16} className="text-gold-dark" />
              Tempat Kegiatan <span className="text-red-500">*</span>
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="Masukkan tempat kegiatan"
              className={inputClass}
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="drive_url"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#38473f]"
            >
              <LinkIcon size={16} className="text-gold-dark" />
              Link Dokumentasi Google Drive
              <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              <input
                id="drive_url"
                name="drive_url"
                type="url"
                value={form.drive_url}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                className={inputClass}
              />

              {form.drive_url && (
                <a
                  href={form.drive_url}
                  target="_blank"
                  rel="noreferrer"
                  title="Buka tautan"
                  className="grid w-12 shrink-0 place-items-center rounded-lg border border-[#ddd9cf] text-primary hover:border-primary hover:bg-primary hover:text-white"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#38473f]">
              <ImagePlus size={16} className="text-gold-dark" />
              Foto Cover
            </label>

            <div className="grid gap-5 md:grid-cols-[1fr_280px]">
              <label
                htmlFor="cover_image"
                className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d9d4c8] bg-[#fbfaf7] px-5 text-center hover:border-primary hover:bg-primary/5"
              >
                <ImagePlus size={31} className="mb-3 text-primary" />

                <p className="text-sm font-bold text-primary-dark">
                  Pilih foto cover
                </p>

                <p className="mt-2 text-xs leading-5 text-[#8a928e]">
                  Format JPG, PNG, atau WEBP
                  <br />
                  Maksimal 5 MB
                </p>

                <input
                  id="cover_image"
                  name="cover_image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>

              <div className="relative min-h-44 overflow-hidden rounded-xl border border-[#e0dcd2] bg-[#f1efe9]">
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Preview cover"
                      className="h-full min-h-44 w-full object-cover"
                    />

                    {coverFile && (
                      <button
                        type="button"
                        onClick={removeSelectedCover}
                        title="Batalkan foto"
                        className="absolute top-3 right-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-black/60 text-white hover:bg-red-600"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="grid h-full min-h-44 place-items-center text-center text-[#9aa09c]">
                    <div>
                      <ImagePlus size={28} className="mx-auto mb-2" />
                      <p className="text-xs">Preview foto cover</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae1] bg-[#fcfbf8] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
          <Link
            to="/admin/kegiatan"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d9d4c8] bg-white px-6 text-sm font-bold text-[#68726c] no-underline hover:border-primary hover:text-primary"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
          >
            <Save size={18} />
            {submitting
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan Kegiatan"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ActivityForm;
