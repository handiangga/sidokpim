import {
  ChevronLeft,
  ChevronRight,
  Filter,
  FolderOpen,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ActivityCard from "../components/public/ActivityCard";
import { getActivities } from "../services/activityService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage, showError } from "../utils/alerts";

const MONTHS = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const initialFilter = {
  search: "",
  category_id: "",
  month: "",
  year: "",
};

const ITEMS_PER_PAGE = 8;

function Home() {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState(initialFilter);
  const [appliedFilter, setAppliedFilter] = useState(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [activityData, categoryData] = await Promise.all([
          getActivities(),
          getCategories(),
        ]);

        setActivities(activityData);
        setCategories(categoryData);
      } catch (error) {
        showError(
          "Gagal memuat kegiatan",
          getErrorMessage(error, "Tidak dapat mengambil dokumentasi kegiatan."),
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const years = useMemo(() => {
    return [
      ...new Set(
        activities
          .map((activity) => activity.date?.slice(0, 4))
          .filter(Boolean),
      ),
    ].sort((a, b) => b.localeCompare(a));
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const keyword = appliedFilter.search.trim().toLowerCase();

    return activities.filter((activity) => {
      const [year, month] = activity.date?.split("-") || [];

      const title = activity.title?.toLowerCase() || "";
      const location = activity.location?.toLowerCase() || "";

      const matchesSearch =
        !keyword || title.includes(keyword) || location.includes(keyword);

      const matchesCategory =
        !appliedFilter.category_id ||
        String(activity.category_id) === appliedFilter.category_id;

      const matchesMonth =
        !appliedFilter.month || String(Number(month)) === appliedFilter.month;

      const matchesYear = !appliedFilter.year || year === appliedFilter.year;

      return matchesSearch && matchesCategory && matchesMonth && matchesYear;
    });
  }, [activities, appliedFilter]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);

  const displayedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage]);

  const hasActiveFilter = Object.values(appliedFilter).some(Boolean);

  function handleChange(event) {
    const { name, value } = event.target;

    setFilter((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function applyFilter(event) {
    event.preventDefault();
    setAppliedFilter(filter);
    setCurrentPage(1);
  }

  function resetFilter() {
    setFilter(initialFilter);
    setAppliedFilter(initialFilter);
    setCurrentPage(1);
  }

  function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 200,
      behavior: "smooth",
    });
  }

  const selectClass =
    "min-h-12 w-full cursor-pointer rounded-lg border border-[#d9dde0] bg-white px-4 text-sm font-semibold text-[#283730] outline-none transition focus:border-[#315b49] focus:ring-4 focus:ring-[#315b49]/10";

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
      <form
        onSubmit={applyFilter}
        className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_0.65fr_0.65fr_0.65fr_190px]"
      >
        <div className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-[#d9dde0] bg-white px-4 transition focus-within:border-[#315b49] focus-within:ring-4 focus-within:ring-[#315b49]/10 md:col-span-2 xl:col-span-1">
          <Search
            size={19}
            className="shrink-0 text-[#315b49]"
            aria-hidden="true"
          />

          <input
            name="search"
            type="search"
            value={filter.search}
            onChange={handleChange}
            placeholder="Cari kegiatan, lokasi, atau kata kunci..."
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#25342d] outline-none placeholder:text-[#8b9691]"
          />
        </div>

        <select
          name="category_id"
          value={filter.category_id}
          onChange={handleChange}
          className={selectClass}
          aria-label="Pilih kategori"
        >
          <option value="">Semua Kategori</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="month"
          value={filter.month}
          onChange={handleChange}
          className={selectClass}
          aria-label="Pilih bulan"
        >
          <option value="">Semua Bulan</option>

          {MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select
          name="year"
          value={filter.year}
          onChange={handleChange}
          className={selectClass}
          aria-label="Pilih tahun"
        >
          <option value="">Semua Tahun</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#294f3e] px-5 text-sm font-bold text-white transition hover:bg-[#173f32] focus:ring-4 focus:ring-[#294f3e]/20 focus:outline-none"
        >
          <Filter size={18} aria-hidden="true" />
          Terapkan
        </button>
      </form>

      <section className="pt-7 pb-10 sm:pt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#101a16] sm:text-2xl">
              Kegiatan Terbaru
            </h2>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={resetFilter}
                className="mt-2 cursor-pointer text-xs font-bold text-[#315b49] transition hover:text-gold-dark"
              >
                Hapus semua filter
              </button>
            )}
          </div>

          {!loading && filteredActivities.length > 0 && (
            <p className="text-xs text-[#7c8580] sm:text-sm">
              Total{" "}
              <span className="font-bold text-[#315b49]">
                {filteredActivities.length}
              </span>{" "}
              kegiatan
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid min-h-72 place-items-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-[#315b49]/20 border-t-[#315b49]" />

              <p className="text-sm text-[#7c8580]">
                Memuat dokumentasi kegiatan...
              </p>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="rounded-xl border border-[#e5e0d5] bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
            <FolderOpen size={45} className="mx-auto mb-4 text-[#bdc4c0]" />

            <h3 className="text-lg font-bold text-[#17231e] sm:text-xl">
              Dokumentasi tidak ditemukan
            </h3>

            <p className="mt-2 text-sm text-[#7c8580]">
              Coba ubah pencarian atau pilihan filter.
            </p>

            <button
              type="button"
              onClick={resetFilter}
              className="mt-5 cursor-pointer rounded-lg bg-[#294f3e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#173f32]"
            >
              Tampilkan Semua
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-xs text-[#7c8580]">
                  Menampilkan{" "}
                  <span className="font-bold text-[#315b49]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredActivities.length,
                    )}
                  </span>{" "}
                  dari {filteredActivities.length} kegiatan
                </p>

                <nav
                  aria-label="Navigasi halaman kegiatan"
                  className="flex flex-wrap items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
                    className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-[#d9dde0] bg-white px-3 text-sm font-semibold text-[#315b49] transition hover:border-[#315b49] hover:bg-[#f5f7f6] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} aria-hidden="true" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    const isActive = page === currentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        aria-label={`Halaman ${page}`}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => changePage(page)}
                        className={`grid h-10 min-w-10 place-items-center rounded-lg border px-3 text-sm font-bold transition ${
                          isActive
                            ? "border-[#294f3e] bg-[#294f3e] text-white"
                            : "border-[#d9dde0] bg-white text-[#315b49] hover:border-[#315b49] hover:bg-[#f5f7f6]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                    className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-[#d9dde0] bg-white px-3 text-sm font-semibold text-[#315b49] transition hover:border-[#315b49] hover:bg-[#f5f7f6] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">Berikutnya</span>
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default Home;
