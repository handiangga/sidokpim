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
import { getErrorMessage, showError } from "../../utils/alerts";

const FILE_URL = import.meta.env.VITE_FILE_URL || "";

const initialForm = {
  category_id: "",
  date: "",
  title: "",
  location: "",
  drive_url: "",
};

function getCoverUrl(coverImage) {
  if (!coverImage) return "";

  if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
    return coverImage;
  }

  return `${FILE_URL}${coverImage}`;
}

function isGoogleDriveUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      ["drive.google.com", "docs.google.com"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [existingCover, setExistingCover] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        setLoading(true);

        const categoryRequest = api.get("/categories");

        if (isEdit) {
          const [categoryResponse, activityResponse] = await Promise.all([
            categoryRequest,
            api.get(`/activities/${id}`),
          ]);

          if (!active) return;

          setCategories(categoryResponse.data.data || []);

          const activity = activityResponse.data.data;

          setForm({
            category_id: String(activity.category_id || ""),
            date: activity.date || "",
            title: activity.title || "",
            location: activity.location || "",
            drive_url: activity.drive_url || "",
          });

          if (activity.cover_image) {
            const coverUrl = getCoverUrl(activity.cover_image);

            setExistingCover(coverUrl);
            setCoverPreview(coverUrl);
          }
        } else {
          const categoryResponse = await categoryRequest;

          if (!active) return;

          setCategories(categoryResponse.data.data || []);
        }
      } catch (error) {
        if (!active) return;

        await showError(
          "Gagal memuat data",
          getErrorMessage(error, "Tidak dapat mengambil data dari server."),
        );

        if (isEdit) {
          navigate("/admin/kegiatan", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [id, isEdit, navigate]);

  useEffect(() => {
    return () => {
      if (coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

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
        confirmButtonColor: "#294f3e",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      await Swal.fire({
        icon: "warning",
        title: "Ukuran foto terlalu besar",
        text: "Ukuran maksimal foto cover adalah 5 MB.",
        confirmButtonColor: "#294f3e",
      });

      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setCoverFile(file);
    setCoverPreview(previewUrl);
    setPreviewError(false);
  }

  function cancelSelectedCover() {
    if (coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(null);
    setCoverPreview(existingCover);
    setPreviewError(false);

    const input = document.getElementById("cover_image");

    if (input) {
      input.value = "";
    }
  }

  async function validateForm() {
    const requiredValues = [
      form.category_id,
      form.date,
      form.title.trim(),
      form.location.trim(),
      form.drive_url.trim(),
    ];

    if (requiredValues.some((value) => !value)) {
      await Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Lengkapi seluruh data kegiatan yang wajib diisi.",
        confirmButtonColor: "#294f3e",
      });

      return false;
    }

    if (!isGoogleDriveUrl(form.drive_url.trim())) {
      await Swal.fire({
        icon: "warning",
        title: "Tautan Google Drive tidak valid",
        text: "Masukkan tautan dari drive.google.com atau docs.google.com.",
        confirmButtonColor: "#294f3e",
      });

      return false;
    }

    if (!isEdit && !coverFile) {
      await Swal.fire({
        icon: "warning",
        title: "Foto cover belum dipilih",
        text: "Pilih foto cover sebelum menyimpan kegiatan.",
        confirmButtonColor: "#294f3e",
      });

      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const valid = await validateForm();

    if (!valid) return;

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
      showError(
        "Gagal menyimpan",
        getErrorMessage(error, "Terjadi kesalahan saat menyimpan kegiatan."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-[#294f3e]/20 border-t-[#294f3e]" />

          <p className="text-sm text-[#7c8580]">Memuat data kegiatan...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "min-h-12 w-full rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 text-sm text-[#27362f] outline-none transition placeholder:text-[#9da5a1] focus:border-[#294f3e] focus:bg-white focus:ring-4 focus:ring-[#294f3e]/10 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-bold text-[#284138]";

  return (
    <section className="mx-auto w-full max-w-[1400px]">
      <div className="mb-6">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/admin/kegiatan"
            className="inline-flex items-center gap-2 font-bold text-[#294f3e] no-underline transition hover:text-[#a67c24]"
          >
            <ArrowLeft size={18} />
            Data Kegiatan
          </Link>

          <span className="text-[#b0a999]">/</span>

          <span className="text-[#747e79]">
            {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"}
          </span>
        </nav>

        <h1 className="text-2xl font-extrabold text-[#173f32] sm:text-3xl">
          {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"}
        </h1>

        <p className="mt-2 text-sm text-[#7c8580] sm:text-base">
          {isEdit
            ? "Perbarui data dokumentasi kegiatan."
            : "Tambahkan dokumentasi kegiatan baru."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-[#e8e3d8] bg-white shadow-sm"
        noValidate
      >
        <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 md:grid-cols-2 lg:p-8">
          <div>
            <label htmlFor="date" className={labelClass}>
              <CalendarDays size={16} className="text-[#a67c24]" />
              Tanggal Kegiatan
              <span className="text-red-500">*</span>
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              disabled={submitting}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category_id" className={labelClass}>
              <Tag size={16} className="text-[#a67c24]" />
              Kategori
              <span className="text-red-500">*</span>
            </label>

            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              disabled={submitting}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Pilih kategori</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClass}>
              <Type size={16} className="text-[#a67c24]" />
              Nama Kegiatan
              <span className="text-red-500">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan nama kegiatan"
              disabled={submitting}
              maxLength={255}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location" className={labelClass}>
              <MapPin size={16} className="text-[#a67c24]" />
              Tempat Kegiatan
              <span className="text-red-500">*</span>
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="Masukkan tempat kegiatan"
              disabled={submitting}
              maxLength={255}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="drive_url" className={labelClass}>
              <LinkIcon size={16} className="text-[#a67c24]" />
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
                disabled={submitting}
                className={inputClass}
              />

              {isGoogleDriveUrl(form.drive_url) && (
                <a
                  href={form.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka tautan Google Drive"
                  aria-label="Buka tautan Google Drive"
                  className="grid min-h-12 w-12 shrink-0 place-items-center rounded-lg border border-[#ddd9cf] bg-white text-[#294f3e] transition hover:border-[#294f3e] hover:bg-[#294f3e] hover:text-white"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              <ImagePlus size={16} className="text-[#a67c24]" />
              Foto Cover
              <span className="text-red-500">*</span>
            </label>

            <p className="mb-3 text-xs leading-5 text-[#8a928e]">
              {isEdit
                ? "Pilih foto baru jika ingin mengganti cover yang tersimpan."
                : "Foto cover wajib dipilih sebelum kegiatan disimpan."}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
              <label
                htmlFor="cover_image"
                className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cfd4d1] bg-[#fbfaf7] px-5 text-center transition hover:border-[#294f3e] hover:bg-[#294f3e]/5 sm:min-h-44"
              >
                <ImagePlus size={34} className="mb-3 text-[#294f3e]" />

                <p className="text-sm font-bold text-[#173f32]">
                  {coverFile ? coverFile.name : "Pilih foto cover"}
                </p>

                <p className="mt-2 text-xs leading-5 text-[#8a928e]">
                  JPG, PNG, atau WEBP
                  <br />
                  Maksimal 5 MB
                </p>

                <input
                  id="cover_image"
                  name="cover_image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  disabled={submitting}
                  className="hidden"
                />
              </label>

              <div className="relative min-h-40 overflow-hidden rounded-xl border border-[#e0dcd2] bg-[#f1efe9] sm:min-h-44">
                {coverPreview && !previewError ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Preview cover kegiatan"
                      className="aspect-video h-full min-h-40 w-full object-cover sm:min-h-44"
                      onError={() => setPreviewError(true)}
                    />

                    {coverFile && (
                      <button
                        type="button"
                        onClick={cancelSelectedCover}
                        title="Batalkan foto yang dipilih"
                        aria-label="Batalkan foto yang dipilih"
                        className="absolute right-3 top-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-black/65 text-white transition hover:bg-red-600"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="grid h-full min-h-40 place-items-center text-center text-[#9aa09c] sm:min-h-44">
                    <div>
                      <ImagePlus size={30} className="mx-auto mb-2" />

                      <p className="text-xs">Preview foto cover</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae1] bg-[#fcfbf8] px-4 py-5 sm:flex-row sm:justify-end sm:px-6 lg:px-8">
          <Link
            to="/admin/kegiatan"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#294f3e] bg-white px-6 text-sm font-bold text-[#294f3e] no-underline transition hover:bg-[#f2f5f3] sm:w-auto"
          >
            Batal
          </Link>

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
                <Save size={18} />
                {isEdit ? "Simpan Perubahan" : "Simpan Kegiatan"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ActivityForm;
