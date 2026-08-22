import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import Queries from "./pages/Queries";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStudentProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.warn("Profile fetch error (could be admin):", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadStudentProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          loadStudentProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@notifyhub.com";
  const isAdmin = session?.user?.email?.toLowerCase() === adminEmail.toLowerCase();

  return (
    <BrowserRouter>
      <Navbar session={session} profile={profile} isAdmin={isAdmin} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/events" element={<Events />} />
        
        <Route
          path="/queries"
          element={
            loading ? (
              <div className="page" style={{ textAlign: "center" }}><h3>Loading portal...</h3></div>
            ) : session ? (
              <Queries session={session} profile={profile} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        <Route
          path="/admin"
          element={
            loading ? (
              <div className="page" style={{ textAlign: "center" }}><h3>Loading portal...</h3></div>
            ) : session && isAdmin ? (
              <Admin session={session} />
            ) : (
              <div className="page" style={{ textAlign: "center", maxWidth: "600px", margin: "50px auto" }}>
                <div className="glass-card" style={{ padding: "40px" }}>
                  <h1 style={{ color: "#ff4d6d" }}>⛔ Access Denied</h1>
                  <p style={{ marginTop: "15px" }}>You do not have administrative privileges to access this area.</p>
                  <button 
                    className="primary-btn" 
                    style={{ marginTop: "20px" }} 
                    onClick={() => window.location.href = "/auth"}
                  >
                    Go to Authentication Portal
                  </button>
                </div>
              </div>
            )
          }
        />
        
        <Route 
          path="/auth" 
          element={
            session ? (
              isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/queries" replace />
            ) : (
              <Auth />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;