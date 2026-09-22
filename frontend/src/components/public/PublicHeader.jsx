import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

function PublicHeader() {
  return (
    <header className="relative overflow-hidden border-b border-[#ebe7de] bg-[#faf9f5]">
      <img
        src="/images/gedung-kejari-sleman.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5] via-white/80 to-[#faf9f5]/85" />

      <div
        className="
          relative mx-auto grid w-full max-w-[1600px]
          grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-5
          px-4 py-6
          sm:grid-cols-[105px_minmax(0,1fr)] sm:gap-x-6 sm:px-6
          lg:min-h-[190px] lg:grid-cols-[150px_minmax(0,1fr)_260px]
          lg:items-center lg:gap-8 lg:px-8 lg:py-5
          xl:grid-cols-[170px_minmax(0,1fr)_280px] xl:px-10
        "
      >
        <Link
          to="/"
          className="self-start text-center no-underline sm:self-center"
        >
          <img
            src="/images/logo-kejaksaan.png"
            alt="Logo Kejaksaan Negeri Sleman"
            className="mx-auto h-16 w-auto object-contain sm:h-24 lg:h-[105px]"
          />

          <p className="mt-2 hidden text-[10px] font-extrabold leading-4 tracking-[0.08em] text-[#111827] sm:block lg:text-xs">
            KEJAKSAAN NEGERI
            <br />
            SLEMAN
          </p>
        </Link>

        <div className="min-w-0 self-center">
          <p className="mb-2 hidden text-xs font-medium text-[#53615a] sm:block lg:mb-3 lg:text-sm">
            Dokumentasi
            <span className="mx-1">•</span>
            Transparansi
            <span className="mx-1">•</span>
            Akuntabilitas
          </p>

          <h1
            className="
              max-w-[720px] text-xl font-extrabold leading-[1.15]
              tracking-[-0.02em] text-[#111815]
              sm:text-2xl
              lg:text-[34px]
              xl:text-[38px]
            "
          >
            <span className="block">Sistem Informasi</span>
            <span className="block">Dokumentasi Kegiatan Pimpinan</span>
          </h1>

          <p className="mt-2 text-sm font-medium text-[#4f5a55] sm:text-base lg:text-lg">
            Kejaksaan Negeri Sleman
          </p>
        </div>

        <div
          className="
            col-span-2 flex items-center justify-between gap-4
            sm:pl-[131px]
            lg:col-span-1 lg:block lg:self-stretch lg:py-3 lg:pl-0
          "
        >

          <div className="hidden pt-16 lg:block">
            <p className="text-right text-sm font-medium leading-6 text-[#17231e]">
              “Bekerja dengan Integritas,
              <br />
              Mengabdi untuk Negeri”
            </p>

            <div className="ml-auto mt-3 h-0.5 w-14 bg-[#b68a2d]" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;
