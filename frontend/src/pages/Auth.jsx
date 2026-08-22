import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Auth() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rollId, setRollId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStudentAuth = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Register Student
        if (!name.trim() || !rollId.trim()) {
          alert("Please provide name and roll ID");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data?.user) {
          const { error: profileError } = await supabase
            .from("students")
            .insert([
              {
                id: data.user.id,
                name: name.trim(),
                roll_id: rollId.trim(),
                email: email.trim().toLowerCase(),
              },
            ]);

          if (profileError) {
            console.error("Profile creation error:", profileError);
            alert("Registered successfully, but failed to create student profile record.");
          } else {
            alert("Student registration successful! You can now log in.");
            setIsRegister(false);
          }
        }
      } else {
        // Login Student
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        // Check if student profile exists
        const { data: studentProfile, error: profileErr } = await supabase
          .from("students")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileErr || !studentProfile) {
          // If the profile isn't found, it might be the admin logging in under student portal
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@notifyhub.com";
          if (data.user.email?.toLowerCase() === adminEmail.toLowerCase()) {
            alert("Admin detected! Logging into Admin Panel.");
            navigate("/admin");
            setLoading(false);
            return;
          }

          alert("No student profile found for this account. If you are an Admin, please use the Admin Portal.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        alert(`Welcome back, ${studentProfile.name}!`);
        navigate("/queries");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      alert("Please fill in email and password");
      return;
    }

    setLoading(true);

    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@notifyhub.com";
      if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
        alert("Access Denied: This email is not configured as an administrator.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      alert("Welcome back, Administrator!");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert(error.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: "450px", margin: "40px auto" }}>
      <div className="page-header" style={{ textAlign: "center", marginBottom: "30px" }}>
        <div className="page-label">
          🔐 SECURITY PORTAL
        </div>
        <h1>
          {isAdminMode ? "Admin" : "Student"}{" "}
          <span>{isRegister && !isAdminMode ? "Register" : "Login"}</span>
        </h1>
        <p>Access your college information hub dashboard.</p>
      </div>

      {/* Portal Type Toggle */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <button
          onClick={() => {
            setIsAdminMode(false);
            setIsRegister(false);
          }}
          className="view-all"
          style={{
            flex: 1,
            background: !isAdminMode ? "linear-gradient(135deg, #6c2cff 0%, #3f8cff 100%)" : "transparent",
            color: !isAdminMode ? "#ffffff" : "#6c2cff",
            border: "1px solid #6c2cff",
            padding: "10px 15px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease"
          }}
        >
          🎓 Student Portal
        </button>
        <button
          onClick={() => {
            setIsAdminMode(true);
            setIsRegister(false);
          }}
          className="view-all"
          style={{
            flex: 1,
            background: isAdminMode ? "linear-gradient(135deg, #6c2cff 0%, #3f8cff 100%)" : "transparent",
            color: isAdminMode ? "#ffffff" : "#6c2cff",
            border: "1px solid #6c2cff",
            padding: "10px 15px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease"
          }}
        >
          ⚙️ Admin Portal
        </button>
      </div>

      <div className="glass-card" style={{ padding: "30px" }}>
        {isAdminMode ? (
          /* =====================================================
             ADMIN PORTAL (LOGIN ONLY)
             ===================================================== */
          <form onSubmit={handleAdminAuth}>
            <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>⚙️ Administrator Login</h2>
            <p style={{ color: "#69728b", fontSize: "14px", marginBottom: "20px" }}>
              Enter administrator credentials. Registration is disabled.
            </p>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Admin Email</label>
              <input
                type="email"
                placeholder="admin@notifyhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>

            <button type="submit" className="primary-btn" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Logging in..." : "🔑 Login as Admin"}
            </button>
          </form>
        ) : (
          /* =====================================================
             STUDENT PORTAL (LOGIN & SIGN UP)
             ===================================================== */
          <form onSubmit={handleStudentAuth}>
            <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
              {isRegister ? "📝 Student Registration" : "🎓 Student Login"}
            </h2>
            <p style={{ color: "#69728b", fontSize: "14px", marginBottom: "20px" }}>
              {isRegister
                ? "Create a new student account to submit queries."
                : "Sign in to query answers and view announcements."}
            </p>

            {isRegister && (
              <>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>College Roll ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 21XX1A0501"
                    value={rollId}
                    onChange={(e) => setRollId(e.target.value)}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Email Address</label>
              <input
                type="email"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>

            {isRegister && (
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: "100%" }}
                />
              </div>
            )}

            <button type="submit" className="primary-btn" style={{ width: "100%", marginBottom: "15px" }} disabled={loading}>
              {loading
                ? "Processing..."
                : isRegister
                ? "📝 Register Account"
                : "🔑 Login to Student Portal"}
            </button>

            <div style={{ textAlign: "center", fontSize: "14px" }}>
              <span style={{ color: "#69728b" }}>
                {isRegister ? "Already have an account? " : "New to NotifyHub? "}
              </span>
              <span
                onClick={() => setIsRegister(!isRegister)}
                style={{ color: "#6c2cff", cursor: "pointer", fontWeight: "bold" }}
              >
                {isRegister ? "Sign In" : "Register Now"}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;
