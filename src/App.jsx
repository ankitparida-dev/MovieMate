import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import About from "./pages/About";
import Main from "./pages/Main";
import LoginPage from './LoginPage';   // <-- 1. IMPORT THIS
import RegPage from './RegPage';     // <-- 2. IMPORT THIS

export default function App() {
  const [page, setPage] = useState("home"); 
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

  const openAboutPage = (item) => {
    const type = item.media_type || (item.title ? "movie" : "tv");
    setSelected({ id: item.id, type: type });
    setPage("about");
  };

  const changePage = (newPage) => {
    setSearchQuery("");
    setPage(newPage);
  }

  return (
    <>
      {/* We're NOT hiding the Navbar anymore */}
      <Navbar 
        setPage={changePage} 
        page={page} 
        onSearch={setSearchQuery} 
      />
      
      {/* --- Your existing pages --- */}
      {page === "home" && (
        <Main 
          onOpen={openAboutPage} 
          searchQuery={searchQuery}
        />
      )}
      {page === "movies" && <Movies onOpen={openAboutPage} />}
      {page === "tvshows" && <TvShows onOpen={openAboutPage} />}
      {page === "about" && selected && (
        <About selected={selected} setPage={changePage} />
      )}
      
      {/* --- 3. ADD THESE TWO NEW LINES --- */}
      {page === "login" && <LoginPage setPage={changePage} />}
      {page === "register" && <RegPage setPage={changePage} />}
      {page !== "login" && page !== "register" && (
        <Footer setPage={changePage} />
      )}

      
    </>
  );
} 