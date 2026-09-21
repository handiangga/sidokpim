import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import DetailActivity from "./pages/DetailActivity";
import Login from "./pages/Login";
import Activities from "./pages/admin/Activities";
import ActivityForm from "./pages/admin/ActivityForm";
import Categories from "./pages/admin/Categories";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/kegiatan/:id" element={<DetailActivity />} />
        </Route>

        {/* Halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman administrator */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="kegiatan" replace />} />

          <Route path="kegiatan" element={<Activities />} />
          <Route path="kegiatan/tambah" element={<ActivityForm />} />
          <Route path="kegiatan/:id/edit" element={<ActivityForm />} />

          <Route path="kategori" element={<Categories />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
