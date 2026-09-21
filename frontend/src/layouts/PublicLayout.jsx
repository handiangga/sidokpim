import { Outlet } from "react-router-dom";
import PublicFooter from "../components/public/PublicFooter";
import PublicHeader from "../components/public/PublicHeader";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfcf9]">
      <PublicHeader />

      <div className="flex-1">
        <Outlet />
      </div>

      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
