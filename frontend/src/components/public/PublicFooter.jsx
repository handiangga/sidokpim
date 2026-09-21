function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#e2ddd2] bg-white">
      <div
        className="
          mx-auto flex w-full max-w-[1600px] flex-col items-center
          gap-2 px-4 py-6 text-center text-xs text-[#78827d]
          sm:px-6
          md:flex-row md:justify-between md:text-left
          lg:px-8
          xl:px-10
        "
      >
        <p>© {currentYear} Kejaksaan Negeri Sleman</p>

        <p>Sistem Informasi Dokumentasi Kegiatan Pimpinan</p>
      </div>
    </footer>
  );
}

export default PublicFooter;
