// frontend/src/App.jsx

import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import About from "./pages/About";
import Main from "./pages/Main";
import MyLibrary from "./pages/MyLibrary";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./LoginPage";
import RegPage from "./RegPage";

import socket from "./socket";

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openAboutPage = (item) => {
    // ✅ Handle page navigation from SpotlightCarousel
    if (item && item.page) {
      setPage(item.page);
      setSelected(null);
      return;
    }
    
    // ✅ Handle movie detail navigation
    if (item && item.id) {
      const type = item.media_type || (item.first_air_date ? "tv" : "movie");
      setSelected({ ...item, type });
      setPage("about");
    }
  };

  const changePage = (newPage) => {
    setSearchQuery("");
    setPage(newPage);
    setSelected(null);
  };

  const hideNavbarFooter = page === "login" || page === "register";

  // Socket.io connection and event listeners
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("activity", (data) => {
      let message = "";
      if (data.category === "favorites") {
        message = `❤️ ${data.userName || 'Someone'} favorited ${data.title}`;
      }
      if (data.category === "watchlist") {
        message = `📌 ${data.userName || 'Someone'} added ${data.title} to watchlist`;
      }
      if (data.category === "comment") {
        message = `💬 ${data.userName || 'Someone'} commented on ${data.title}`;
      }
      if (data.category === "rating") {
        message = `⭐ ${data.userName || 'Someone'} rated ${data.title} ${data.rating}/10`;
      }
      if (data.category === "review") {
        message = `📝 ${data.userName || 'Someone'} reviewed ${data.title}`;
      }
      if (data.category === "list") {
        message = `📋 ${data.userName || 'Someone'} created a new list: ${data.title}`;
      }
      if (message) {
        toast(message, {
          duration: 4000,
          icon: '🔔',
        });
      }
    });

    socket.on("onlineUsers", (count) => {
      console.log("👥 Online Users:", count);
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.off("activity");
      socket.off("onlineUsers");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      {/* TOAST NOTIFICATIONS CONTAINER */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#112240",
            color: "#ffffff",
            borderRadius: "12px",
            borderLeft: "4px solid #2ec4b6",
          },
        }}
      />

      {!hideNavbarFooter && (
        <Navbar setPage={changePage} page={page} onSearch={setSearchQuery} />
      )}

      {/* MAIN PAGES */}
      {page === "home" && <Main onOpen={openAboutPage} searchQuery={searchQuery} setPage={changePage} />}
      {page === "movies" && <Movies onOpen={openAboutPage} />}
      {page === "tvshows" && <TvShows onOpen={openAboutPage} />}
      
      {/* ✅ LIBRARY - Now includes Notes & Ratings */}
      {page === "library" && <MyLibrary onOpen={openAboutPage} />}
      
      {page === "analytics" && <Analytics onOpen={openAboutPage} />}
      {page === "profile" && <Profile setPage={changePage} />}
      {page === "admin" && <AdminDashboard />}
      
      {page === "about" && selected && (
        <About selected={selected} setPage={changePage} onOpen={openAboutPage} />
      )}

      {/* AUTH ROUTES */}
      {page === "login" && <LoginPage setPage={changePage} />}
      {page === "register" && <RegPage setPage={changePage} />}

      {!hideNavbarFooter && <Footer setPage={changePage} />}
    </>
  );
}