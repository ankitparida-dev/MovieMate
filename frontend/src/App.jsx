import { useState } from "react";

// Correct imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import About from "./pages/About";
import Main from "./pages/Main";

// --- 1. IMPORT THE NEW LIBRARY PAGE ---
import MyLibrary from "./pages/MyLibrary"; 

// Login + Register pages
import LoginPage from "./LoginPage";
import RegPage from "./RegPage";
import { getData, postData } from "./api/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openAboutPage = (item) => {
    // Ensure we have a media type
    const type = item.media_type || (item.first_air_date ? "tv" : "movie");
    setSelected({ ...item, type: type }); // Pass the whole item + type
    setPage("about");
  };

  const changePage = (newPage) => {
    setSearchQuery("");
    setPage(newPage);
  };

  const hideNavbarFooter = page === "login" || page === "register";

  return (
    <>
      {/* Hide navbar on login & register */}
      {!hideNavbarFooter && (
        <Navbar setPage={changePage} page={page} onSearch={setSearchQuery} />
      )}

      {/* PAGE ROUTING */}
      {page === "home" && (
        <Main onOpen={openAboutPage} searchQuery={searchQuery} />
      )}

      {page === "movies" && <Movies onOpen={openAboutPage} />}

      {page === "tvshows" && <TvShows onOpen={openAboutPage} />}

      {/* --- 2. ADD THE LIBRARY PAGE CONDITION --- */}
      {page === "library" && (
        <MyLibrary onOpen={openAboutPage} /> 
      )}

      {page === "about" && selected && (
        <About selected={selected} setPage={changePage} onOpen={openAboutPage}/>
      )}

      {/* LOGIN & REGISTER */}
      {page === "login" && <LoginPage setPage={changePage} />}
      {page === "register" && <RegPage setPage={changePage} />}

      {/* Hide Footer on login/register */}
      {!hideNavbarFooter && <Footer setPage={changePage} />}
    </>
  );
}