import { FolderOpen, ImageOff, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { getFileUrl } from "../../utils/files";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function getDateParts(date) {
  if (!date) {
    return {
      day: "-",
      month: "-",
      year: "-",
    };
  }

  const [year, month, day] = date.split("-");

  return {
    day: Number(day),
    month: MONTHS[Number(month) - 1],
    year,
  };
}

function ActivityCard({ activity }) {
  const date = getDateParts(activity.date);

  return (
    <article className="group overflow-hidden rounded-xl border border-[#e4e1da] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/kegiatan/${activity.id}`}
        className="relative block overflow-hidden bg-[#eeece6]"
      >
        {activity.cover_image ? (
          <img
            src={getFileUrl(activity.cover_image)}
            alt={activity.title}
            className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid aspect-[16/9] place-items-center text-[#a8afab]">
            <ImageOff size={34} />
          </div>
        )}

        <div className="absolute top-3 left-3 min-w-[70px] rounded-lg bg-white px-3 py-2 text-center shadow-md">
          <p className="text-xl leading-none font-extrabold text-[#17231e]">
            {date.day}
          </p>
          <p className="mt-1 text-[11px] font-bold text-[#34433c]">
            {date.month} {date.year}
          </p>
        </div>

        <span className="absolute bottom-0 left-4 rounded-t-lg bg-[#f5e8c5] px-3 py-1.5 text-xs font-bold text-[#453d29]">
          {activity.category?.name || "Tanpa kategori"}
        </span>
      </Link>

      <div className="flex min-h-[195px] flex-col p-4">
        <h2 className="line-clamp-2 min-h-12 text-[16px] leading-6 font-extrabold text-[#111827]">
          {activity.title}
        </h2>

        <div className="mt-3 flex min-h-10 items-start gap-2 text-sm text-[#68736d]">
          <MapPin size={16} className="mt-0.5 shrink-0 text-[#315b49]" />
          <span className="line-clamp-2">{activity.location}</span>
        </div>

        <Link
          to={`/kegiatan/${activity.id}`}
          className="mt-auto inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#eff2ed] text-sm font-bold text-[#17231e] no-underline hover:bg-[#294f3e] hover:text-white"
        >
          <FolderOpen size={18} />
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}

export default ActivityCard;
