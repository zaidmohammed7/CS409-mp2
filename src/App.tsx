import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import SearchPage from "./pages/SearchPage";
import GalleryPage from "./pages/GalleryPage";
import DetailsPage from "./pages/DetailsPage";
import { SearchProvider } from "./context/SearchContext";

export default function App() {
  return (
    <SearchProvider>
      <div className="container">
        <h1 className="title">Pokédex Directory</h1>
        <NavBar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </SearchProvider>
  );
}
