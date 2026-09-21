import {
  CalendarDays,
  ExternalLink,
  FolderOpen,
  ImageOff,
  MapPin,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { getErrorMessage, showError } from "../utils/alerts";

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

function DetailItem({ icon: Icon, label, children }) {
  return (
    <div className="grid grid-cols-[24px_80px_1fr] gap-3 border-b border-[#e5e8e6] py-4 last:border-b-0 sm:grid-cols-[24px_92px_1fr]">
      <Icon
        size={20}
        strokeWidth={1.9}
        className="mt-0.5 text-[#18211d]"
        aria-hidden="true"
      />

      <span className="text-sm text-[#687570]">{label}</span>

      <span className="min-w-0 break-words text-sm font-semibold leading-6 text-[#17231e]">
        {children}
      </span>
    </div>
  );
}

function DetailActivity() {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchActivity() {
      try {
        setLoading(true);
        setNotFound(false);

        const response = await api.get(`/activities/${id}`);

        if (active) {
          setActivity(response.data.data);
        }
      } catch (error) {
        if (!active) return;

        if (error.response?.status === 404) {
          setNotFound(true);
          return;
        }

        showError(
          "Gagal memuat kegiatan",
          getErrorMessage(error, "Tidak dapat mengambil detail kegiatan."),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchActivity();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="grid min-h-[55vh] place-items-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#315b49]/20 border-t-[#315b49]" />

          <p className="text-sm text-[#7c8580]">Memuat detail kegiatan...</p>
        </div>
      </main>
    );
  }

  if (notFound || !activity) {
    return (
      <main className="mx-auto grid min-h-[55vh] max-w-[1600px] place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-lg text-center">
          <FolderOpen size={52} className="mx-auto mb-5 text-[#bdc4c0]" />

          <h1 className="text-2xl font-extrabold text-[#17231e] sm:text-3xl">
            Kegiatan tidak ditemukan
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#7c8580]">
            Data kegiatan mungkin telah dihapus atau alamat yang digunakan tidak
            sesuai.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#294f3e] px-6 text-sm font-bold text-white no-underline transition hover:bg-[#173f32]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const coverUrl = getCoverUrl(activity.cover_image);

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-2 text-sm"
      >
        <Link
          to="/"
          className="font-semibold text-[#315b49] no-underline transition hover:text-[#173f32]"
        >
          Beranda
        </Link>

        <span className="text-[#9ba39f]">/</span>

        <span className="text-[#65716b]">Detail Kegiatan</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(340px,0.95fr)]">
        <article className="min-w-0 overflow-hidden rounded-xl border border-[#dfe4e1] bg-white p-3 shadow-sm sm:p-4">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={activity.title || "Foto kegiatan"}
              className="aspect-[16/10] w-full rounded-lg object-cover sm:aspect-[16/9] xl:aspect-[16/6]"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling?.classList.remove(
                  "hidden",
                );
              }}
            />
          ) : null}

          <div
            className={`${
              coverUrl ? "hidden" : ""
            } grid aspect-[16/10] place-items-center rounded-lg bg-[#eceae3] text-[#a7ada9] sm:aspect-[16/9] xl:aspect-[16/6]`}
          >
            <div className="text-center">
              <ImageOff size={44} className="mx-auto mb-3" />

              <p className="text-sm">Foto cover belum tersedia</p>
            </div>
          </div>

          <div className="px-1 pb-2 pt-5 sm:px-1 sm:pt-6">
            <span className="inline-flex max-w-full items-center rounded-lg bg-[#fff0cc] px-4 py-2 text-xs font-bold text-[#4b3b14]">
              {activity.category?.name || "Tanpa kategori"}
            </span>

            <h1 className="mt-3 break-words text-xl font-extrabold leading-snug text-[#111815] sm:text-2xl lg:text-3xl">
              {activity.title || "Kegiatan tanpa judul"}
            </h1>

            <div className="mt-4 flex flex-col gap-3 text-sm text-[#53625b] sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <div className="flex items-center gap-2">
                <CalendarDays size={20} className="shrink-0 text-[#17231e]" />

                <span>{formatDate(activity.date)}</span>
              </div>

              <span
                className="hidden h-7 w-px bg-[#dfe4e1] sm:block"
                aria-hidden="true"
              />

              <div className="flex min-w-0 items-start gap-2">
                <MapPin size={20} className="mt-0.5 shrink-0 text-[#17231e]" />

                <span className="break-words">{activity.location || "-"}</span>
              </div>
            </div>
          </div>
        </article>

        <aside className="min-w-0 rounded-xl border border-[#dfe4e1] bg-white p-5 shadow-sm sm:p-6 xl:sticky xl:top-5">
          <h2 className="text-xl font-extrabold text-[#111815] sm:text-2xl">
            Dokumentasi Kegiatan
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#5f6d67] sm:text-base">
            Akses seluruh dokumentasi kegiatan ini melalui Google Drive. Dokumen
            dapat berupa foto, surat, notulen, dan berkas pendukung lainnya yang
            terkait dengan kegiatan.
          </p>

          {activity.drive_url ? (
            <a
              href={activity.drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#294f3e] px-4 text-center text-sm font-bold text-white no-underline transition hover:bg-[#173f32] focus:outline-none focus:ring-4 focus:ring-[#294f3e]/20 sm:text-base"
            >
              <FolderOpen size={22} className="shrink-0" />
              <span>Buka Dokumentasi Google Drive</span>
              <ExternalLink size={17} className="shrink-0" />
            </a>
          ) : (
            <div className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#e8ebe9] px-4 text-center text-sm font-semibold text-[#7a847f]">
              <FolderOpen size={20} />
              Dokumentasi belum tersedia
            </div>
          )}

          <div className="mt-6 border-t border-[#e5e8e6]">
            <DetailItem icon={CalendarDays} label="Tanggal">
              {formatDate(activity.date)}
            </DetailItem>

            <DetailItem icon={Tag} label="Kategori">
              {activity.category?.name || "-"}
            </DetailItem>

            <DetailItem icon={MapPin} label="Lokasi">
              {activity.location || "-"}
            </DetailItem>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default DetailActivity;
