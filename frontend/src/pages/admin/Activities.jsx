import {
  CalendarDays,
  ExternalLink,
  FolderOpen,
  ImageOff,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import { getErrorMessage, showError } from "../../utils/alerts";

const FILE_URL = import.meta.env.VITE_FILE_URL || "";

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getCoverUrl(coverImage) {
  if (!coverImage) return null;

  if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
    return coverImage;
  }

  return `${FILE_URL}${coverImage}`;
}

function ActivityImage({ activity, className = "" }) {
  const coverUrl = getCoverUrl(activity.cover_image);
  const [imageError, setImageError] = useState(false);

  if (!coverUrl || imageError) {
    return (
      <div
        className={`grid place-items-center bg-[#f0eee8] text-[#a5aaa7] ${className}`}
      >
        <ImageOff size={24} />
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={activity.title || "Cover kegiatan"}
      className={`object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
}

function ActionButtons({ activity, onDelete, mobile = false }) {
  return (
    <div className={`flex gap-2 ${mobile ? "w-full" : "justify-center"}`}>
      <Link
        to={`/admin/kegiatan/${activity.id}/edit`}
        title="Edit kegiatan"
        aria-label={`Edit ${activity.title}`}
        className={`
          inline-flex min-h-10 items-center justify-center gap-2
          rounded-lg border border-[#d9d4c8] font-bold
          text-[#294f3e] no-underline transition
          hover:border-[#294f3e] hover:bg-[#294f3e] hover:text-white
          ${mobile ? "flex-1 px-4 text-sm" : "h-10 w-10"}
        `}
      >
        <Pencil size={16} />
        {mobile && <span>Edit</span>}
      </Link>

      <button
        type="button"
        title="Hapus kegiatan"
        aria-label={`Hapus ${activity.title}`}
        onClick={() => onDelete(activity)}
        className={`
          inline-flex min-h-10 cursor-pointer items-center justify-center
          gap-2 rounded-lg border border-[#ead4d4] bg-white
          font-bold text-[#b44343] transition
          hover:border-[#b44343] hover:bg-[#b44343] hover:text-white
          ${mobile ? "flex-1 px-4 text-sm" : "h-10 w-10"}
        `}
      >
        <Trash2 size={16} />
        {mobile && <span>Hapus</span>}
      </button>
    </div>
  );
}

function EmptyState({ filtered, onReset }) {
  return (
    <div className="px-5 py-14 text-center sm:py-16">
      <CalendarDays size={44} className="mx-auto mb-3 text-[#c7ccc9]" />

      <p className="font-bold text-[#59645e]">Data kegiatan tidak ditemukan</p>

      <p className="mt-1 text-sm text-[#929995]">
        {filtered
          ? "Coba ubah kata pencarian atau filter kategori."
          : "Belum ada data kegiatan yang ditambahkan."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 cursor-pointer rounded-lg bg-[#294f3e] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#173f32]"
        >
          Tampilkan Semua
        </button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#294f3e]/20 border-t-[#294f3e]" />

      <p className="text-sm text-[#7c8580]">Memuat data kegiatan...</p>
    </div>
  );
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  const hasFilter = Boolean(search.trim() || categoryId);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (categoryId) {
        params.category_id = categoryId;
      }

      const response = await api.get("/activities", { params });

      setActivities(response.data.data || []);
    } catch (error) {
      showError(
        "Gagal memuat kegiatan",
        getErrorMessage(error, "Tidak dapat mengambil data dari server."),
      );
    } finally {
      setLoading(false);
    }
  }, [search, categoryId]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.data || []);
      } catch (error) {
        showError(
          "Gagal memuat kategori",
          getErrorMessage(error, "Tidak dapat mengambil kategori dari server."),
        );
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const delay = window.setTimeout(fetchActivities, 350);

    return () => window.clearTimeout(delay);
  }, [fetchActivities]);

  async function handleDelete(activity) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus kegiatan?",
      text: `"${activity.title}" akan dihapus secara permanen.`,
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#b44343",
      cancelButtonColor: "#8a918d",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/activities/${activity.id}`);

      await Swal.fire({
        icon: "success",
        title: "Berhasil dihapus",
        text: "Data kegiatan telah dihapus.",
        showConfirmButton: false,
        timer: 1300,
      });

      await fetchActivities();
    } catch (error) {
      showError(
        "Gagal menghapus",
        getErrorMessage(error, "Terjadi kesalahan saat menghapus kegiatan."),
      );
    }
  }

  function resetFilter() {
    setSearch("");
    setCategoryId("");
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a67c24] sm:text-[11px]">
            Pengelolaan Dokumentasi
          </p>

          <h1 className="text-2xl font-extrabold text-[#17231e] sm:text-3xl">
            Data Kegiatan
          </h1>

          <p className="mt-2 text-sm text-[#7c8580]">
            Kelola data dan tautan dokumentasi kegiatan.
          </p>
        </div>

        <Link
          to="/admin/kegiatan/tambah"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#294f3e] px-5 text-sm font-bold text-white no-underline shadow-sm transition hover:bg-[#173f32] sm:w-auto"
        >
          <Plus size={18} />
          Tambah Kegiatan
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-[#e8e3d8] bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[minmax(300px,1fr)_260px_auto]">
        <div className="flex min-h-12 items-center gap-3 rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 transition focus-within:border-[#294f3e] focus-within:ring-4 focus-within:ring-[#294f3e]/10 sm:col-span-2 xl:col-span-1">
          <Search size={18} className="shrink-0 text-[#65716b]" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama atau lokasi kegiatan..."
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#27362f] outline-none"
          />

          {search && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={() => setSearch("")}
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md text-[#89928d] hover:bg-[#eceae3] hover:text-[#294f3e]"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          aria-label="Filter kategori"
          className="min-h-12 w-full cursor-pointer rounded-lg border border-[#ddd9cf] bg-[#fbfaf7] px-4 text-sm font-semibold text-[#38473f] outline-none focus:border-[#294f3e] focus:ring-4 focus:ring-[#294f3e]/10"
        >
          <option value="">Semua kategori</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={resetFilter}
          disabled={!hasFilter}
          className="min-h-12 cursor-pointer rounded-lg border border-[#d9d4c8] px-5 text-sm font-bold text-[#647069] transition hover:border-[#294f3e] hover:text-[#294f3e] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e8e3d8] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eeeae1] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#294f3e]/10 text-[#294f3e]">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#17231e]">
                Daftar Kegiatan
              </p>

              <p className="text-xs text-[#8a928e]">
                {loading
                  ? "Mengambil data..."
                  : `${activities.length} data ditemukan`}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : activities.length === 0 ? (
          <EmptyState filtered={hasFilter} onReset={resetFilter} />
        ) : (
          <>
            {/* Tampilan tablet dan HP */}
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:hidden">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="min-w-0 overflow-hidden rounded-xl border border-[#e8e3d8] bg-white"
                >
                  <ActivityImage
                    activity={activity}
                    className="aspect-[16/9] w-full"
                  />

                  <div className="p-4">
                    <span className="inline-flex rounded-full bg-[#294f3e]/10 px-3 py-1.5 text-xs font-bold text-[#294f3e]">
                      {activity.category?.name || "Tanpa kategori"}
                    </span>

                    <h2 className="mt-3 break-words text-base font-extrabold leading-6 text-[#17231e]">
                      {activity.title || "Kegiatan tanpa judul"}
                    </h2>

                    <div className="mt-4 space-y-3 text-sm text-[#59655f]">
                      <div className="flex items-start gap-2">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-[#a67c24]"
                        />

                        <span>{formatDate(activity.date)}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-[#a67c24]"
                        />

                        <span className="break-words">
                          {activity.location || "-"}
                        </span>
                      </div>
                    </div>

                    {activity.drive_url ? (
                      <a
                        href={activity.drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#f0f2ef] px-4 text-sm font-bold text-[#294f3e] no-underline transition hover:bg-[#e3e8e4]"
                      >
                        <FolderOpen size={17} />
                        Dokumentasi
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <div className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#f3f2ee] px-4 text-xs font-semibold text-[#929995]">
                        <FolderOpen size={16} />
                        Dokumentasi belum tersedia
                      </div>
                    )}

                    <div className="mt-4 border-t border-[#eeeae1] pt-4">
                      <ActionButtons
                        activity={activity}
                        onDelete={handleDelete}
                        mobile
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Tampilan desktop */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[920px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#faf9f5] text-[11px] uppercase tracking-wider text-[#77807b]">
                    <th className="px-5 py-4 font-bold">Cover</th>
                    <th className="px-5 py-4 font-bold">Kegiatan</th>
                    <th className="px-5 py-4 font-bold">Tanggal</th>
                    <th className="px-5 py-4 font-bold">Kategori</th>
                    <th className="px-5 py-4 font-bold">Lokasi</th>
                    <th className="px-5 py-4 text-center font-bold">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eeeae1]">
                  {activities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="transition hover:bg-[#fcfbf8]"
                    >
                      <td className="px-5 py-4">
                        <ActivityImage
                          activity={activity}
                          className="h-16 w-24 rounded-lg"
                        />
                      </td>

                      <td className="max-w-[280px] px-5 py-4">
                        <p className="font-bold leading-6 text-[#17231e]">
                          {activity.title || "Kegiatan tanpa judul"}
                        </p>

                        {activity.drive_url && (
                          <a
                            href={activity.drive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#a67c24] no-underline transition hover:text-[#294f3e]"
                          >
                            Buka dokumentasi
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#59655f]">
                        {formatDate(activity.date)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-[#294f3e]/10 px-3 py-1.5 text-xs font-bold text-[#294f3e]">
                          {activity.category?.name || "-"}
                        </span>
                      </td>

                      <td className="max-w-[220px] px-5 py-4">
                        <div className="flex items-start gap-2 text-sm leading-6 text-[#59655f]">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-[#a67c24]"
                          />

                          <span className="break-words">
                            {activity.location || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <ActionButtons
                          activity={activity}
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
  );
}

export default Activities;
