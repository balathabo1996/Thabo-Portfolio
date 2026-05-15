"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import NetworkBackground from "@/components/NetworkBackground";

export default function AdminDashboard() {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      category: "",
    },
  });
  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
  } = useForm();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeLabel, setActiveLabel] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Data States
  const [stats, setStats] = useState({ resumeDownloads: 0 });
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [media, setMedia] = useState([]);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [skillCatOpen, setSkillCatOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 150);
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      fetchAllData(savedToken);
    }
    return () => clearTimeout(timer);
  }, []);

  const verifyAndFetch = async (key) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        setIsAuthenticated(true);
        setAuthToken(data.token);
        localStorage.setItem("admin_token", data.token);
        fetchAllData(data.token);
      } else {
        setMessage({ text: data.error || "Invalid API Key", type: "error" });
        setIsAuthenticated(false);
      }
    } catch (err) {
      setMessage({ text: "Error connecting to server", type: "error" });
    }
    setLoading(false);
  };

  const fetchAllData = async (token) => {
    const activeToken = token || authToken;
    if (!activeToken) return;

    const fetchOptions = {
      headers: {
        "x-api-key": activeToken,
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    };

    const timestamp = Date.now();

    const fetchItems = [
      { url: `/api/stats?t=${timestamp}`, setter: setStats, name: "Stats" },
      {
        url: `/api/profile?t=${timestamp}`,
        setter: setProfile,
        name: "Profile",
      },
      {
        url: `/api/projects?all=true&t=${timestamp}`,
        setter: setProjects,
        name: "Projects",
      },
      {
        url: `/api/experience?all=true&t=${timestamp}`,
        setter: setExperience,
        name: "Experience",
      },
      { url: `/api/skills?t=${timestamp}`, setter: setSkills, name: "Skills" },
      { url: `/api/media?t=${timestamp}`, setter: setMedia, name: "Media" },
    ];

    fetchItems.forEach((item) => {
      fetch(item.url, fetchOptions)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log(`Fetched ${item.name}:`, data);
          // Handle cases where data is wrapped in an object (like Media resources)
          const finalData = data.resources || data;
          item.setter(finalData);
        })
        .catch((err) => {
          console.error(`${item.name} fetch error:`, err);
        });
    });
  };

  const handleLogin = ({ passphrase }) => {
    setAuthToken(passphrase); // temp store; will be replaced with JWT after verify
    verifyAndFetch(passphrase);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_token");
    setAuthToken("");
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const apiCall = async (url, method, body) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": authToken,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(
          body && body.status !== undefined
            ? `Status updated to ${body.status}`
            : isEditing
              ? "Updated successfully"
              : "Created successfully",
        );
        if (!body || body.status === undefined) resetForm();
        fetchAllData();
        return data;
      } else {
        showMessage(data.error || "Operation failed", "error");
      }
    } catch (err) {
      showMessage("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    // Profile tab: restore saved data. All other tabs: clear to blank.
    if (activeTab === "profile") {
      reset(profile);
    } else {
      // Force a full clear including selects by resetting each key to ''
      reset({
        title: "",
        subTitle: "",
        period: "",
        link: "",
        imageUrl: "",
        award: "",
        description: "",
        features: "",
        techStack: "",
        order: "",
        category: "",
        role: "",
        company: "",
        location: "",
        name: "",
        icon: "",
        type: "",
      });
    }
  };

  const startEdit = (item) => {
    const formattedDescription = Array.isArray(item.description)
      ? item.description.join("\n")
      : item.description || "";

    const baseData = { ...item, description: formattedDescription };

    if (activeTab === "projects") {
      if (Array.isArray(item.features))
        baseData.features = item.features.join("\n");
      if (Array.isArray(item.techStack))
        baseData.techStack = item.techStack.join(", ");
    }

    reset(baseData);
    setIsEditing(true);
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Populate the form whenever the profile tab is active and profile data is ready
  useEffect(() => {
    if (activeTab === "profile" && profile && Object.keys(profile).length > 0) {
      reset(profile);
    }
  }, [activeTab, profile]);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-api-key": authToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile({ ...profile, [field]: data.url });
        setValue(field, data.url);
        showMessage("File uploaded successfully");
      } else {
        showMessage(data.error || "Upload failed", "error");
      }
    } catch (err) {
      showMessage("Upload error", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <style jsx>{`
          :global(html, body) {
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
            overflow: hidden;
          }
          .admin-login {
            height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #020617;
            color: white;
            position: relative;
            overflow: hidden;
            font-family: var(--font-outfit), sans-serif;
          }
          .login-container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 420px;
            padding: 20px;
          }
          .login-card {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(20px);
            padding: 3.5rem 2.5rem;
            border-radius: 2rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .logo-box {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #4f46e5, #818cf8);
            border-radius: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            font-size: 1.5rem;
            color: white;
            box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
          }
          h1 {
            margin-bottom: 0.5rem;
            font-size: 1.75rem;
            font-weight: 900;
            letter-spacing: -0.025em;
            background: linear-gradient(to right, #fff, #94a3b8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p.subtitle {
            color: #94a3b8;
            font-size: 0.875rem;
            margin-bottom: 2.5rem;
          }
          .input-group {
            position: relative;
            margin-bottom: 1.5rem;
          }
          .input-group i {
            position: absolute;
            left: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            transition: 0.3s;
          }
          input {
            width: 100%;
            padding: 1.1rem 1rem 1.1rem 3.25rem;
            background: rgba(2, 6, 23, 0.5);
            border: 1px solid rgba(51, 65, 85, 0.5);
            border-radius: 1rem;
            color: white;
            outline: none;
            font-size: 1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          input:focus {
            border-color: #4f46e5;
            background: rgba(2, 6, 23, 0.8);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
          }
          input:focus + i {
            color: #818cf8;
          }
          button {
            width: 100%;
            padding: 1.1rem;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            font-weight: 700;
            font-size: 1rem;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          }
          button:hover:not(:disabled) {
            background: #4338ca;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
          }
          button:active:not(:disabled) {
            transform: translateY(0);
          }
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .error-msg {
            margin-top: 1.5rem;
            padding: 0.75rem;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 0.75rem;
            color: #f87171;
            font-size: 0.8rem;
          }
        `}</style>

        <NetworkBackground />

        <div className="login-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="login-card"
          >
            <div className="logo-box">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h1>Control Panel</h1>
            <p className="subtitle">Enter your secret passphrase to continue</p>

            <form onSubmit={loginHandleSubmit(handleLogin)}>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Passphrase"
                  autoFocus
                  {...loginRegister("passphrase", {
                    required: "Passphrase is required",
                    minLength: {
                      value: 6,
                      message: "Must be at least 6 characters",
                    },
                  })}
                />
                <i className="fas fa-lock"></i>
                {loginErrors.passphrase && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: "0.78rem",
                      marginTop: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    <i
                      className="fas fa-exclamation-circle"
                      style={{ marginRight: "0.4rem" }}
                    ></i>
                    {loginErrors.passphrase.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>
                    Verifying...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {message.text && message.type === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="error-msg"
              >
                <i
                  className="fas fa-exclamation-circle"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                {message.text}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <style jsx>{`
        :global(html, body) {
          padding: 0 !important;
          margin: 0 !important;
          background-image: none !important;
        }
        .admin-root {
          display: flex;
          min-height: 100vh;
          background: #0f172a;
          color: #f1f5f9;
          font-family: "Inter", sans-serif;
          overflow: hidden;
        }

        .sidebar {
          width: 280px;
          background: #020617;
          border-right: 1px solid #1e293b;
          height: 100vh;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: sticky;
          top: 0;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sidebar::-webkit-scrollbar {
          display: none;
        }
        .logo {
          font-size: 1.1rem;
          font-weight: 900;
          color: #818cf8;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem;
        }

        .nav-section {
          margin-bottom: 1.25rem;
        }
        .nav-title {
          font-size: 0.6rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
          padding-left: 0.5rem;
        }
        .nav-link {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }
        .nav-link:hover {
          background: #1e293b;
          color: white;
        }
        .nav-link.active {
          background: #4f46e5;
          color: white;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .content-area {
          flex: 1;
          padding: 2.5rem;
          height: 100vh;
          overflow-y: auto;
          background: #0f172a;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .content-area::-webkit-scrollbar {
          display: none;
        }
        .content-container {
          width: 100%;
          margin: 0;
        }

        .card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          border: 1px solid #334155;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .card-title {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid #334155;
          padding-bottom: 1rem;
        }
        .card-title i {
          color: #818cf8;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .stat-box {
          background: #1e293b;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid #334155;
          transition: 0.3s;
        }
        .stat-box:hover {
          transform: translateY(-5px);
          border-color: #6366f1;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          line-height: 1.2;
          min-height: 1.8rem;
          display: flex;
          align-items: flex-end;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: white;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .input-wrap {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-wrap label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        input,
        select,
        textarea {
          width: 100%;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          padding: 0 1rem;
          height: 46px;
          color: white;
          transition: 0.2s;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
        }
        textarea {
          padding: 0.85rem 1rem;
          height: auto;
          min-height: 100px;
        }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25rem;
          padding-right: 3rem !important;
          cursor: pointer;
        }
        .input-focus {
          border-color: #4f46e5;
          background: #1e293b;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        /* ── CUSTOM DROPDOWN ── */
        .custom-select-wrapper {
          position: relative;
          width: 100%;
        }
        .custom-select-trigger {
          width: 100%;
          height: 46px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          padding: 0 1rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: 0.2s;
          font-size: 0.95rem;
        }
        .custom-select-trigger:hover {
          border-color: #4b5563;
        }
        .custom-select-trigger.open {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        .custom-select-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 0.75rem;
          overflow: hidden;
          z-index: 9999;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          margin-top: 0.25rem;
        }
        .custom-select-option {
          padding: 0.75rem 1rem;
          color: #94a3b8;
          cursor: pointer;
          transition: 0.2s;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .custom-select-option:hover {
          background: rgba(79, 70, 229, 0.1);
          color: white;
        }
        .custom-select-option.selected {
          color: #818cf8;
          background: rgba(79, 70, 229, 0.15);
        }
        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          background: #020617;
        }

        .btn {
          padding: 0.85rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
          border: none;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .btn-blue {
          background: #4f46e5;
          color: white;
        }
        .btn-blue:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }
        .btn-gray {
          background: #334155;
          color: #f1f5f9;
        }
        .btn-gray:hover {
          background: #475569;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          border-radius: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          margin-bottom: 0.75rem;
          border: 1px solid transparent;
          transition: 0.2s;
        }
        .item-row:hover {
          border-color: #334155;
          background: #0f172a;
        }
        .item-info h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #f1f5f9;
        }
        .item-info p {
          margin: 0.25rem 0 0 0;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .item-actions {
          display: flex;
          gap: 0.5rem;
        }
        .action-icon {
          width: 36px;
          height: 36px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
          background: #1e293b;
          border: 1px solid #334155;
        }
        .action-icon.edit {
          color: #818cf8;
        }
        .action-icon.edit:hover {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }
        .action-icon.delete {
          color: #f87171;
        }
        .action-icon.delete:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        /* ── SECURITY ROWS ── */
        .security-row {
          background: #1e293b;
          border-radius: 0.75rem;
          padding: 0.9rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #334155;
          gap: 1rem;
        }
        @media (max-width: 500px) {
          .security-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4rem;
          }
          .security-status-badge {
            margin-left: 1.25rem;
          }
        }

        /* ── UPLOAD UI ── */
        .upload-input-group {
          display: flex;
          gap: 0.5rem;
          align-items: stretch;
        }
        .upload-btn {
          width: 46px !important;
          height: 46px !important;
          padding: 0 !important;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
        }

        /* ── TOP BAR & CONTENT ── */
        .top-bar {
          position: sticky;
          top: 0;
          z-index: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2.5rem;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 2rem;
        }
        .top-bar-left,
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .top-bar-indicator {
          width: 4px;
          height: 24px;
          background: #4f46e5;
          border-radius: 4px;
        }
        .content-container {
          padding: 0 2.5rem 2.5rem 2.5rem;
        }

        .btn-label {
          display: inline;
        }

        @media (max-width: 768px) {
          .top-bar {
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
          }
          .top-bar-indicator {
            display: none;
          }
          .content-container {
            padding: 0 1rem 2rem 1rem;
          }
          .btn-label {
            display: none;
          }
          .btn {
            padding: 0.5rem 0.75rem;
            min-width: 40px;
          }
          .btn i {
            margin: 0 !important;
          }
        }

        /* ── OVERLAY (mobile) ── */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 599;
        }
        .sidebar-overlay.open {
          display: block;
        }

        /* ── HAMBURGER BUTTON ── */
        .hamburger {
          display: none;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid #334155;
          border-radius: 0.5rem;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #94a3b8;
          font-size: 1.1rem;
          transition: 0.2s;
          flex-shrink: 0;
        }
        .hamburger:hover {
          background: #1e293b;
          color: white;
        }

        /* ── TABLET (≤1024px) ── */
        @media (max-width: 1024px) {
          .sidebar {
            width: 260px;
            padding: 1.25rem;
          }
          .content-area {
            padding: 1.5rem;
          }
          .card {
            padding: 1.75rem;
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* ── MOBILE (≤768px) ── */
        @media (max-width: 768px) {
          .admin-root {
            overflow: visible;
          }

          .hamburger {
            display: flex;
          }

          .sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            z-index: 600;
            width: 280px;
            height: 100dvh;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: none;
          }
          .sidebar.open {
            left: 0;
            box-shadow: 4px 0 40px rgba(0, 0, 0, 0.5);
          }

          .content-area {
            height: 100dvh;
            padding: 0;
            width: 100vw;
          }

          .card {
            padding: 1.25rem;
            margin-bottom: 1.25rem;
            border-radius: 0.75rem;
          }
          .card-title {
            font-size: 0.9rem;
            margin-bottom: 1.25rem;
          }

          .grid-2 {
            grid-template-columns: 1fr !important;
            gap: 0;
          }

          .stats-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem;
          }

          .action-icon {
            width: 42px;
            height: 42px;
            font-size: 1rem;
          }

          .btn {
            padding: 0.75rem 1.1rem;
            font-size: 0.8rem;
          }

          .item-row {
            padding: 1rem;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .item-actions {
            margin-left: auto;
          }

          .top-bar-title { font-size: 0.9rem !important; }

          .chart-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }

        /* ── SMALL MOBILE (≤480px) ── */
        @media (max-width: 480px) {
          .stats-row {
            grid-template-columns: 1fr !important;
          }
          .card {
            padding: 1rem;
          }
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <i className="fas fa-terminal"></i> THABO.CORE
        </div>

        <div className="nav-section">
          <div className="nav-title">General</div>
          <div
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-chart-pie"></i> Overview
          </div>
          <div
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-user-circle"></i> Profile
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-title">Experience</div>
          <div
            className={`nav-link ${activeTab === "exp-work" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("exp-work");
              resetForm();
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-briefcase"></i> Work history
          </div>
          <div
            className={`nav-link ${activeTab === "exp-edu" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("exp-edu");
              resetForm();
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-graduation-cap"></i> Education
          </div>
          <div
            className={`nav-link ${activeTab === "exp-ach" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("exp-ach");
              resetForm();
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-trophy"></i> Achievements
          </div>
          <div
            className={`nav-link ${activeTab === "exp-vol" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("exp-vol");
              resetForm();
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-hand-holding-heart"></i> Voluntary
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-title">Content</div>
          <div
            className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("projects");
              resetForm();
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-folder"></i> Projects
          </div>
          <div
            className={`nav-link ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("skills");
              resetForm();
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-tools"></i> Skills
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-title">System</div>
          <div
            className={`nav-link ${activeTab === "system" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("system");
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-server"></i> System & Backup
          </div>
          <div
            className={`nav-link ${activeTab === "media" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("media");
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-images"></i> Media Manager
          </div>
        </div>
      </aside>

      <main className="content-area" style={{ padding: 0 }}>
        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <i className={`fas fa-${sidebarOpen ? "times" : "bars"}`}></i>
            </button>
            <div className="top-bar-indicator"></div>
            <h2
              className="top-bar-title"
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                margin: 0,
                letterSpacing: "0.025em",
                color: "#f1f5f9",
              }}
            >
              {(() => {
                const names = {
                  overview: "Dashboard Overview",
                  profile: "Profile Management",
                  projects: "Projects & Portfolio",
                  skills: "Technical Skills",
                  "exp-work": "Work History",
                  "exp-edu": "Education & Academic",
                  "exp-ach": "Achievements & Awards",
                  "exp-vol": "Voluntary & Other",
                  system: "System & Backup",
                };
                return names[activeTab] || activeTab.toUpperCase();
              })()}
            </h2>
          </div>
          <div className="top-bar-right">
            <a
              href="/"
              target="_blank"
              className="btn btn-gray"
              style={{
                background: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <i
                className="fas fa-external-link-alt"
                style={{ marginRight: "0.5rem" }}
              ></i>
              <span className="btn-label">View Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="btn btn-gray"
              style={{
                color: "#f87171",
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(248, 113, 113, 0.2)",
              }}
            >
              <i
                className="fas fa-power-off"
                style={{ marginRight: "0.5rem" }}
              ></i>
              <span className="btn-label">Logout</span>
            </button>
          </div>
        </div>

        <div className="content-container">
          {activeTab === "overview" && (
            <div className="overview-container">
              {/* Welcome Hero */}
              <div
                className="hero-banner"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  borderRadius: "1.5rem",
                  padding: "3rem",
                  marginBottom: "2.5rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.4)",
                }}
              >
                <div style={{ position: "relative", zIndex: 2 }}>
                  <h2
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      marginBottom: "0.5rem",
                      color: "white",
                    }}
                  >
                    Welcome back, Thabo
                  </h2>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      fontWeight: 500,
                    }}
                  >
                    Your portfolio is currently live and synchronized with the
                    global edge network.
                  </p>
                </div>
                {/* Decorative elements */}
                <div
                  style={{
                    position: "absolute",
                    right: "-50px",
                    top: "-50px",
                    width: "300px",
                    height: "300px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    zIndex: 1,
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    right: "100px",
                    bottom: "-80px",
                    width: "200px",
                    height: "200px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "50%",
                    zIndex: 1,
                  }}
                ></div>
              </div>

              {/* Stats Row */}
              <div
                className="stats-row"
                style={{
                  marginBottom: "2.5rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "1.25rem",
                }}
              >
                <div
                  className="stat-card"
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(10px)",
                    padding: "2rem",
                    borderRadius: "1.25rem",
                    border: "1px solid #334155",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "rgba(79, 70, 229, 0.1)",
                      color: "#818cf8",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      fontSize: "1.25rem",
                    }}
                  >
                    <i className="fas fa-eye" style={{ margin: "auto" }}></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Resume Views
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "white",
                    }}
                  >
                    {stats.resumeDownloads || 0}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      marginTop: "0.5rem",
                    }}
                  >
                    total downloads
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      height: "8px",
                      width: "8px",
                      borderRadius: "50%",
                      background: "#818cf8",
                      boxShadow: "0 0 10px #818cf8",
                    }}
                  ></div>
                </div>

                <div
                  className="stat-card"
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(10px)",
                    padding: "2rem",
                    borderRadius: "1.25rem",
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "#34d399",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      fontSize: "1.25rem",
                    }}
                  >
                    <i
                      className="fas fa-project-diagram"
                      style={{ margin: "auto" }}
                    ></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Total Projects
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "white",
                    }}
                  >
                    {stats.publishedProjects ?? projects.length}
                  </div>
                  {stats.draftProjects > 0 && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#fbbf24",
                        marginTop: "0.5rem",
                      }}
                    >
                      <i
                        className="fas fa-file-alt"
                        style={{ marginRight: "0.3rem" }}
                      ></i>
                      {stats.draftProjects} draft
                      {stats.draftProjects > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div
                  className="stat-card"
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(10px)",
                    padding: "2rem",
                    borderRadius: "1.25rem",
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "rgba(245, 158, 11, 0.1)",
                      color: "#fbbf24",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      fontSize: "1.25rem",
                    }}
                  >
                    <i
                      className="fas fa-history"
                      style={{ margin: "auto" }}
                    ></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Timeline Nodes
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "white",
                    }}
                  >
                    {stats.totalExperience ?? experience.length}
                  </div>
                  {stats.draftExperience > 0 && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#fbbf24",
                        marginTop: "0.5rem",
                      }}
                    >
                      <i
                        className="fas fa-file-alt"
                        style={{ marginRight: "0.3rem" }}
                      ></i>
                      {stats.draftExperience} draft
                      {stats.draftExperience > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div
                  className="stat-card"
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(10px)",
                    padding: "2rem",
                    borderRadius: "1.25rem",
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      fontSize: "1.25rem",
                    }}
                  >
                    <i
                      className="fas fa-photo-video"
                      style={{ margin: "auto" }}
                    ></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Media Assets
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "white",
                    }}
                  >
                    {stats.totalSkills ?? skills.length}
                  </div>
                  {stats.draftSkills > 0 && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#fbbf24",
                        marginTop: "0.5rem",
                      }}
                    >
                      <i
                        className="fas fa-file-alt"
                        style={{ marginRight: "0.3rem" }}
                      ></i>
                      {stats.draftSkills} draft
                      {stats.draftSkills > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Media Assets (Cloudinary) */}
                <div
                  className="stat-card"
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    backdropFilter: "blur(10px)",
                    padding: "2rem",
                    borderRadius: "1.25rem",
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "rgba(244, 114, 182, 0.1)",
                      color: "#f472b6",
                      borderRadius: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      fontSize: "1.25rem",
                    }}
                  >
                    <i
                      className="fas fa-photo-video"
                      style={{ margin: "auto" }}
                    ></i>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Media Assets
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "white",
                    }}
                  >
                    {media?.length || 0}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#f472b6",
                      marginTop: "0.5rem",
                    }}
                  >
                    <i
                      className="fas fa-cloud"
                      style={{ marginRight: "0.3rem" }}
                    ></i>
                    Cloudinary CDN
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <div className="card-title">
                    <i className="fas fa-shield-alt"></i> Control Center
                  </div>
                  <div
                    className="status-grid"
                    style={{ display: "grid", gap: "1rem" }}
                  >
                    <div
                      style={{
                        background: "#1e293b",
                        padding: "1rem 1.25rem",
                        borderRadius: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#10b981",
                          }}
                        ></div>
                        <span
                          style={{
                            color: "#f1f5f9",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          Database Cluster
                        </span>
                      </div>
                      <span
                        style={{
                          color: "#10b981",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        Healthy
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#1e293b",
                        padding: "1rem 1.25rem",
                        borderRadius: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#10b981",
                          }}
                        ></div>
                        <span
                          style={{
                            color: "#f1f5f9",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          Cloudinary CDN
                        </span>
                      </div>
                      <span
                        style={{
                          color: "#10b981",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        Operational
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#1e293b",
                        padding: "1rem 1.25rem",
                        borderRadius: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#3b82f6",
                          }}
                        ></div>
                        <span
                          style={{
                            color: "#f1f5f9",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          Email Service
                        </span>
                      </div>
                      <span
                        style={{
                          color: "#3b82f6",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        Standby
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="card"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(30, 41, 59, 0.5) 100%)",
                  }}
                >
                  <div className="card-title" style={{ color: "#818cf8" }}>
                    <i className="fas fa-bolt"></i> Quick Actions
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <button
                      className="btn btn-gray"
                      style={{
                        background: "#1e293b",
                        justifyContent: "flex-start",
                        padding: "1rem",
                      }}
                      onClick={() => setActiveTab("projects")}
                    >
                      <i className="fas fa-plus"></i> New Project
                    </button>
                    <button
                      className="btn btn-gray"
                      style={{
                        background: "#1e293b",
                        justifyContent: "flex-start",
                        padding: "1rem",
                      }}
                      onClick={() => setActiveTab("skills")}
                    >
                      <i className="fas fa-layer-group"></i> Manage Skills
                    </button>
                    <button
                      className="btn btn-gray"
                      style={{
                        background: "#1e293b",
                        justifyContent: "flex-start",
                        padding: "1rem",
                      }}
                      onClick={() => setActiveTab("profile")}
                    >
                      <i className="fas fa-address-card"></i> Profile Settings
                    </button>
                    <button
                      className="btn btn-blue"
                      style={{ justifyContent: "flex-start", padding: "1rem" }}
                      onClick={() => window.open("/", "_blank")}
                    >
                      <i className="fas fa-external-link-alt"></i> View Website
                    </button>
                  </div>
                </div>
              </div>

              {/* Recharts Content Breakdown */}
              <div className="card" style={{ marginTop: "2rem", overflow: 'hidden' }}>
                <div className="card-title" style={{ marginBottom: '2rem' }}>
                  <i className="fas fa-chart-pie" style={{ color: '#818cf8' }}></i> Portfolio Asset Distribution
                </div>
                
                <div className="chart-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
                  {/* Left Column: The Chart */}
                  <div style={{ position: 'relative', height: 340, width: '100%', minWidth: 0, minHeight: 0 }}>
                    {/* Background Glow */}
                    <div style={{ 
                      position: 'absolute', 
                      width: '180px', 
                      height: '180px', 
                      borderRadius: '50%', 
                      background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 0
                    }}></div>

                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {isMounted && (
                        <PieChart width={550} height={340}>
                          <Pie
                            onMouseEnter={(data) => setActiveLabel(data.name)}
                            onMouseLeave={() => setActiveLabel(null)}
                            data={[
                              { name: "Projects", color: "#34d399", value: stats.publishedProjects ?? projects.filter((p) => p.status !== "draft").length },
                              { name: "Experience", color: "#818cf8", value: stats.totalExperience ?? experience.length },
                              { name: "Skills", color: "#a78bfa", value: stats.totalSkills ?? skills.length },
                              { name: "Drafts", color: "#fbbf24", value: (stats.draftProjects || 0) + (stats.draftExperience || 0) + (stats.draftSkills || 0) },
                              { name: "Media", color: "#f472b6", value: (media?.length || 0) },
                            ].filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={105}
                            outerRadius={activeLabel ? 140 : 135}
                            paddingAngle={8}
                            dataKey="value"
                            isAnimationActive={false}
                            stroke="none"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
                              if (name !== activeLabel) return null;
                              const RADIAN = Math.PI / 180;
                              const radius = outerRadius + 35;
                              const x = cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              
                              const chartData = [
                                { name: "Projects", value: stats.publishedProjects ?? projects.filter((p) => p.status !== "draft").length },
                                { name: "Experience", value: stats.totalExperience ?? experience.length },
                                { name: "Skills", value: stats.totalSkills ?? skills.length },
                                { name: "Drafts", value: (stats.draftProjects || 0) + (stats.draftExperience || 0) + (stats.draftSkills || 0) },
                                { name: "Media", value: (media?.length || 0) }
                              ].filter(d => d.value > 0);
                              
                              const total = chartData.reduce((acc, item) => acc + item.value, 0);
                              const p = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="white"
                                  textAnchor={x > cx ? 'start' : 'end'}
                                  dominantBaseline="central"
                                  style={{ fontSize: '0.85rem', fontWeight: 800, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                                >
                                  {name} {p}%
                                </text>
                              );
                            }}
                            labelLine={({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
                              if (name !== activeLabel) return null;
                              const RADIAN = Math.PI / 180;
                              const inner = outerRadius + 5;
                              const outer = outerRadius + 25;
                              const x1 = cx + inner * Math.cos(-midAngle * RADIAN);
                              const y1 = cy + inner * Math.sin(-midAngle * RADIAN);
                              const x2 = cx + outer * Math.cos(-midAngle * RADIAN);
                              const y2 = cy + outer * Math.sin(-midAngle * RADIAN);
                              return (
                                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                              );
                            }}
                          >
                            {[
                              { name: "Projects", color: "#34d399", value: stats.publishedProjects ?? projects.filter((p) => p.status !== "draft").length },
                              { name: "Experience", color: "#818cf8", value: stats.totalExperience ?? experience.length },
                              { name: "Skills", color: "#a78bfa", value: stats.totalSkills ?? skills.length },
                              { name: "Drafts", color: "#fbbf24", value: (stats.draftProjects || 0) + (stats.draftExperience || 0) + (stats.draftSkills || 0) },
                              { name: "Media", color: "#f472b6", value: (media?.length || 0) },
                            ].filter(d => d.value > 0).map((entry, i) => (
                              <Cell 
                                key={`cell-${i}`} 
                                fill={entry.color} 
                                style={{ 
                                  filter: activeLabel === entry.name ? `drop-shadow(0 0 12px ${entry.color}40)` : 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  transform: activeLabel === entry.name ? 'scale(1.05)' : 'scale(1)',
                                  transformOrigin: 'center'
                                }}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      )}
                    </div>

                    {/* Center Label (Modernized) */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                      zIndex: 100
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>Assets</div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 0.9, textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
                        {(stats.publishedProjects || 0) + (stats.totalExperience || 0) + (stats.totalSkills || 0) + (stats.draftProjects || 0) + (media?.length || 0)}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#4ade80', fontWeight: 700, marginTop: '0.5rem', opacity: 0.8 }}>ONLINE</div>
                    </div>
                  </div>

                  {/* Right Column: Detailed Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { label: "Projects", count: stats.publishedProjects ?? projects.length, color: "#34d399", icon: "fa-folder" },
                      { label: "Experience", count: stats.totalExperience ?? experience.length, color: "#818cf8", icon: "fa-briefcase" },
                      { label: "Skills", count: stats.totalSkills ?? skills.length, color: "#a78bfa", icon: "fa-terminal" },
                      { label: "Drafts", count: (stats.draftProjects || 0) + (stats.draftExperience || 0), color: "#fbbf24", icon: "fa-file-signature" },
                      { label: "Media", count: (media?.length || 0), color: "#f472b6", icon: "fa-photo-video" },
                    ].map((item) => {
                      const total = (stats.publishedProjects || 0) + (stats.totalExperience || 0) + (stats.totalSkills || 0) + (stats.draftProjects || 0) + (media?.length || 0);
                      const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
                      const isHovered = activeLabel === item.label;
                      
                      return (
                        <div 
                          key={item.label} 
                          onMouseEnter={() => setActiveLabel(item.label)}
                          onMouseLeave={() => setActiveLabel(null)}
                          style={{ 
                            background: isHovered ? `${item.color}10` : 'rgba(30, 41, 59, 0.4)', 
                            padding: '0.85rem 1.25rem', 
                            borderRadius: '1rem', 
                            border: '1px solid',
                            borderColor: isHovered ? `${item.color}40` : 'rgba(255,255,255,0.03)',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
                            boxShadow: isHovered ? `0 10px 30px -10px ${item.color}30` : 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: '0.75rem', 
                            background: isHovered ? item.color : `${item.color}15`, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: isHovered ? '#0f172a' : item.color, 
                            border: `1px solid ${item.color}30`,
                            transition: 'all 0.3s ease'
                          }}>
                            <i className={`fas ${item.icon}`}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isHovered ? 'white' : '#f1f5f9' }}>{item.label}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: item.color }}>{item.count}</span>
                            </div>
                            <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                style={{ height: '100%', background: item.color, borderRadius: 2 }}
                              />
                            </div>
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: isHovered ? item.color : '#475569', width: '35px', textAlign: 'right', transition: 'all 0.3s ease' }}>{percent}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="card">
              <div className="card-title">
                <i className="fas fa-user-edit"></i> Edit Profile
              </div>
              <form
                onSubmit={handleSubmit((data) =>
                  apiCall("/api/profile", "PUT", data),
                )}
              >
                <div className="grid-2">
                  <div className="input-wrap">
                    <label>First Name</label>
                    <input
                      {...register("firstName")}
                      placeholder="e.g. Thabotharan"
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Last Name</label>
                    <input
                      {...register("lastName")}
                      placeholder="e.g. Balachandran"
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="input-wrap">
                    <label>Title</label>
                    <input
                      {...register("title")}
                      placeholder="e.g. Infrastructure Engineer"
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Role</label>
                    <input
                      {...register("role")}
                      placeholder="e.g. Senior IT Administrator"
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="input-wrap">
                    <label>Email</label>
                    <input
                      {...register("email")}
                      placeholder="e.g. name@example.com"
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Phone</label>
                    <input
                      {...register("phone")}
                      placeholder="e.g. +1 (416) 000-0000"
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="input-wrap">
                    <label>Location</label>
                    <input
                      {...register("location")}
                      placeholder="e.g. Scarborough, ON, Canada"
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Profile Image</label>
                    <div className="upload-input-group">
                      <input
                        style={{ flex: 1, minWidth: 0 }}
                        {...register("profileImageUrl")}
                        placeholder="Cloudinary URL (auto-filled on upload)"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id="img-upload"
                        onChange={(e) => handleFileUpload(e, "profileImageUrl")}
                      />
                      <button
                        type="button"
                        className="btn btn-gray upload-btn"
                        onClick={() =>
                          document.getElementById("img-upload").click()
                        }
                      >
                        <i className="fas fa-upload"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="input-wrap">
                    <label>LinkedIn URL</label>
                    <input
                      {...register("linkedinUrl")}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="input-wrap">
                    <label>GitHub URL</label>
                    <input
                      {...register("githubUrl")}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="input-wrap">
                    <label>Resume URL</label>
                    <input
                      {...register("resumeUrl")}
                      placeholder="Paste Google Drive or Dropbox share link"
                    />
                  </div>
                </div>
                <div className="input-wrap">
                  <label>Mission Description</label>
                  <textarea
                    rows="3"
                    {...register("missionDescription")}
                    placeholder="Briefly describe your professional mission or objective..."
                  />
                </div>
                <div className="input-wrap">
                  <label>Detailed Professional Bio</label>
                  <textarea
                    rows="6"
                    {...register("bio")}
                    placeholder="Write a detailed professional biography..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-blue"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Update"}
                </button>
              </form>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {activeTab === "projects" &&
            (() => {
              const onSubmit = handleSubmit((data) => {
                if (typeof data.features === "string")
                  data.features = data.features
                    .split("\n")
                    .filter((l) => l.trim());
                if (typeof data.techStack === "string")
                  data.techStack = data.techStack
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                const method = isEditing ? "PUT" : "POST";
                const payload = isEditing ? { ...data, id: editId } : data;
                apiCall("/api/projects", method, payload).then(() =>
                  resetForm(),
                );
              });
              return (
                <>
                  <div
                    className="card"
                    style={{ position: "relative", zIndex: catOpen ? 100 : 1 }}
                  >
                    <div className="card-title">
                      <i className="fas fa-plus"></i>{" "}
                      {isEditing ? "Edit Project" : "New Project"}
                    </div>
                    <form onSubmit={onSubmit}>
                      <div className="grid-2">
                        <div className="input-wrap">
                          <label>Title</label>
                          <input
                            {...register("title", { required: true })}
                            placeholder="e.g. Enterprise Cloud Migration"
                          />
                        </div>
                        <div className="input-wrap">
                          <label>Sub-title / Role</label>
                          <input
                            {...register("subTitle")}
                            placeholder="e.g. Lead System Architect"
                          />
                        </div>
                      </div>
                      <div className="grid-2">
                        <div className="input-wrap">
                          <label>Period</label>
                          <input
                            placeholder="e.g., Jan 2024 – Present"
                            {...register("period")}
                          />
                        </div>
                        <div className="input-wrap">
                          <label>Project Link</label>
                          <input
                            {...register("link")}
                            placeholder="https://project-demo.com"
                          />
                        </div>
                      </div>
                      <div className="grid-2">
                        <div className="input-wrap">
                          <label>Image</label>
                          <div className="upload-input-group">
                            <input
                              style={{ flex: 1, minWidth: 0 }}
                              placeholder="Image URL"
                              {...register("imageUrl")}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              id="proj-img-upload"
                              onChange={(e) => handleFileUpload(e, "imageUrl")}
                            />
                            <button
                              type="button"
                              className="btn btn-gray upload-btn"
                              onClick={() =>
                                document
                                  .getElementById("proj-img-upload")
                                  .click()
                              }
                            >
                              <i className="fas fa-upload"></i>
                            </button>
                          </div>
                        </div>
                        <div
                          className="input-wrap"
                          style={{ zIndex: catOpen ? 50 : 1 }}
                        >
                          <label>Category</label>
                          <div className="custom-select-wrapper">
                            <div
                              className={`custom-select-trigger ${catOpen ? "open" : ""}`}
                              onClick={() => setCatOpen(!catOpen)}
                            >
                              <span>
                                {watch("category")
                                  ? {
                                      web: "Web Development",
                                      app: "Mobile App",
                                      infra: "Infrastructure",
                                      sec: "Security",
                                    }[watch("category")]
                                  : "Select Category"}
                              </span>
                              <i
                                className={`fas fa-chevron-down transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                              ></i>
                            </div>
                            <input type="hidden" {...register("category")} />
                            <AnimatePresence>
                              {catOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="custom-select-dropdown"
                                  style={{
                                    position: "absolute",
                                    background: "#1e293b",
                                    width: "100%",
                                    left: 0,
                                    zIndex: 1000,
                                  }}
                                >
                                  {[
                                    { id: "web", name: "Web Development" },
                                    { id: "app", name: "Mobile App" },
                                    { id: "infra", name: "Infrastructure" },
                                    { id: "sec", name: "Security" },
                                  ].map((opt) => (
                                    <div
                                      key={opt.id}
                                      className={`custom-select-option ${watch("category") === opt.id ? "selected" : ""}`}
                                      onClick={() => {
                                        setValue("category", opt.id);
                                        setCatOpen(false);
                                      }}
                                    >
                                      {opt.name}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      <div className="input-wrap">
                        <label>Award / Achievement</label>
                        <input
                          placeholder="Title: Description"
                          {...register("award")}
                        />
                      </div>
                      <div className="input-wrap">
                        <label>Description</label>
                        <textarea rows="3" {...register("description")} />
                      </div>
                      <div className="input-wrap">
                        <label>Key Features (one per line)</label>
                        <textarea
                          rows="4"
                          placeholder="Title: Description or just Feature"
                          {...register("features")}
                        />
                      </div>
                      <div className="input-wrap">
                        <label>Tech Stack (comma-separated)</label>
                        <input
                          placeholder="Next.js, MongoDB, React"
                          {...register("techStack")}
                        />
                      </div>
                      <div className="input-wrap">
                        <label>Order</label>
                        <input
                          type="number"
                          {...register("order", { valueAsNumber: true })}
                          placeholder="0"
                        />
                      </div>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                          type="submit"
                          className="btn btn-blue"
                          disabled={loading}
                        >
                          {isEditing ? "Save Changes" : "Add Project"}
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            className="btn btn-gray"
                            onClick={resetForm}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="card">
                    <div
                      className="card-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <span>
                        <i className="fas fa-folder-open"></i> All Projects
                      </span>
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.4rem 0.75rem",
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "0.5rem",
                          color: "#f1f5f9",
                          width: "200px",
                          outline: "none",
                        }}
                      />
                    </div>
                    {loading && projects.length === 0 ? (
                      <>
                        <ItemRowSkeleton />
                        <ItemRowSkeleton />
                        <ItemRowSkeleton />
                      </>
                    ) : projects.filter(
                        (p) =>
                          p.title
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (p.subTitle || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                      ).length > 0 ? (
                      projects
                        .filter(
                          (p) =>
                            p.title
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            (p.subTitle || "")
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((item) => (
                          <div
                            key={item._id}
                            className="item-row"
                            style={{
                              opacity: item.status === "draft" ? 0.65 : 1,
                            }}
                          >
                            <div className="item-info">
                              <h4
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                {item.title}
                                {item.status === "draft" && (
                                  <span
                                    style={{
                                      fontSize: "0.6rem",
                                      fontWeight: 800,
                                      color: "#fbbf24",
                                      background: "rgba(251,191,36,0.1)",
                                      border: "1px solid rgba(251,191,36,0.3)",
                                      borderRadius: "0.3rem",
                                      padding: "0.15rem 0.4rem",
                                      letterSpacing: "0.05em",
                                    }}
                                  >
                                    DRAFT
                                  </span>
                                )}
                              </h4>
                              <p>{item.subTitle || item.category}</p>
                            </div>
                            <div className="item-actions">
                              <div
                                className="action-icon"
                                title={
                                  item.status === "draft"
                                    ? "Publish"
                                    : "Set as Draft"
                                }
                                onClick={() =>
                                  apiCall("/api/projects", "PUT", {
                                    _id: item._id,
                                    status:
                                      item.status === "draft"
                                        ? "published"
                                        : "draft",
                                  })
                                }
                                style={{
                                  color:
                                    item.status === "draft"
                                      ? "#fbbf24"
                                      : "#34d399",
                                  background:
                                    item.status === "draft"
                                      ? "rgba(251,191,36,0.08)"
                                      : "rgba(52,211,153,0.08)",
                                }}
                              >
                                <i
                                  className={`fas fa-${item.status === "draft" ? "eye-slash" : "eye"}`}
                                ></i>
                              </div>
                              <div
                                className="action-icon edit"
                                onClick={() => startEdit(item)}
                              >
                                <i className="fas fa-edit"></i>
                              </div>
                              <div
                                className="action-icon delete"
                                onClick={() =>
                                  apiCall(
                                    `/api/projects?id=${item._id}`,
                                    "DELETE",
                                  )
                                }
                              >
                                <i className="fas fa-trash"></i>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p
                        style={{
                          color: "#475569",
                          textAlign: "center",
                          padding: "2rem",
                        }}
                      >
                        {searchQuery
                          ? `No projects match "${searchQuery}"`
                          : "No projects found. Add your first project above!"}
                      </p>
                    )}
                  </div>
                </>
              );
            })()}

          {/* ── SYSTEM TAB ── */}
          {activeTab === "system" && (
            <>
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-database"></i> Database Backup
                </div>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    marginBottom: "1.5rem",
                    lineHeight: 1.7,
                  }}
                >
                  Export a complete snapshot of your portfolio database —
                  including all projects, experiences, skills, and profile data
                  — as a single JSON file. Store it somewhere safe for disaster
                  recovery.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-blue"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const res = await fetch("/api/backup", {
                          headers: { "x-api-key": authToken },
                        });
                        if (!res.ok)
                          throw new Error("Failed to generate backup");
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showMessage("Backup downloaded successfully!");
                      } catch (err) {
                        showMessage(err.message, "error");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <i className="fas fa-download"></i>{" "}
                    {loading ? "Generating..." : "Download Full Backup"}
                  </button>
                  <button
                    className="btn btn-gray"
                    onClick={() => fetchAllData()}
                  >
                    <i className="fas fa-sync-alt"></i> Refresh Data
                  </button>
                </div>
              </div>
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-chart-pie"></i> Database Summary
                </div>
                <div
                  className="stats-row"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    margin: 0,
                  }}
                >
                  {[
                    {
                      label: "Total Projects",
                      value: stats.totalProjects ?? projects.length,
                      icon: "fa-folder",
                      color: "#34d399",
                    },
                    {
                      label: "Published",
                      value:
                        stats.publishedProjects ??
                        projects.filter((p) => p.status !== "draft").length,
                      icon: "fa-eye",
                      color: "#60a5fa",
                    },
                    {
                      label: "Drafts",
                      value: stats.draftProjects ?? 0,
                      icon: "fa-file-alt",
                      color: "#fbbf24",
                    },
                    {
                      label: "Experience Entries",
                      value: stats.totalExperience ?? experience.length,
                      icon: "fa-briefcase",
                      color: "#818cf8",
                    },
                    {
                      label: "Total Skills",
                      value: stats.totalSkills ?? skills.length,
                      icon: "fa-terminal",
                      color: "#a78bfa",
                    },
                    {
                      label: "Resume Downloads",
                      value: stats.resumeDownloads ?? 0,
                      icon: "fa-download",
                      color: "#f472b6",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "#1e293b",
                        borderRadius: "0.75rem",
                        padding: "1.25rem",
                        border: "1px solid #334155",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "0.5rem",
                            background: `${s.color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: s.color,
                          }}
                        >
                          <i className={`fas ${s.icon}`}></i>
                        </div>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            lineHeight: 1.3,
                            display: "block",
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 900,
                          color: "white",
                        }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-shield-alt"></i> Security Status
                </div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    {
                      label: "JWT Authentication",
                      status: "Active",
                      color: "#10b981",
                    },
                    {
                      label: "API Middleware Guard",
                      status: "Enforced",
                      color: "#10b981",
                    },
                    {
                      label: "Session Token",
                      status: authToken ? "Valid (8h)" : "None",
                      color: authToken ? "#10b981" : "#f87171",
                    },
                    {
                      label: "Database Connection",
                      status: "Encrypted (TLS)",
                      color: "#10b981",
                    },
                  ].map((s) => (
                    <div key={s.label} className="security-row">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: s.color,
                            boxShadow: `0 0 6px ${s.color}`,
                          }}
                        ></div>
                        <span
                          style={{
                            color: "#f1f5f9",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <span
                        className="security-status-badge"
                        style={{
                          color: s.color,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── MEDIA MANAGER TAB ── */}
          {activeTab === "media" && (
            <div className="card">
              <div
                className="card-title"
                style={{ justifyContent: "space-between" }}
              >
                <span>
                  <i className="fas fa-images"></i> Cloudinary Assets
                </span>
                <button
                  className="btn btn-gray"
                  onClick={() => fetchAllData()}
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                >
                  <i className="fas fa-sync-alt"></i> Refresh
                </button>
              </div>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  marginBottom: "1.5rem",
                  lineHeight: 1.6,
                }}
              >
                View and manage all images uploaded to your Cloudinary storage.
                You can copy URLs for use in your projects or delete unused
                assets.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {loading && media.length === 0 ? (
                  <>
                    <div
                      className="skeleton"
                      style={{ aspectRatio: "1", borderRadius: "1rem" }}
                    ></div>
                    <div
                      className="skeleton"
                      style={{ aspectRatio: "1", borderRadius: "1rem" }}
                    ></div>
                    <div
                      className="skeleton"
                      style={{ aspectRatio: "1", borderRadius: "1rem" }}
                    ></div>
                  </>
                ) : media && media.length > 0 ? (
                  media.map((item) => (
                    <div
                      key={item.public_id}
                      style={{
                        background: "#1e293b",
                        borderRadius: "1rem",
                        overflow: "hidden",
                        border: "1px solid #334155",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "1",
                          background: "#0f172a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.secure_url}
                          alt={item.public_id}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#f1f5f9",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.public_id.split("/").pop()}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "auto",
                          }}
                        >
                          <button
                            className="btn btn-blue"
                            style={{
                              padding: "0.4rem",
                              flex: 1,
                              fontSize: "0.7rem",
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(item.secure_url);
                              showMessage("URL copied to clipboard!");
                            }}
                          >
                            <i className="fas fa-copy"></i> Copy Link
                          </button>
                          <button
                            className="btn btn-gray"
                            style={{
                              padding: "0.4rem",
                              width: "38px",
                              color: "#f87171",
                            }}
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this asset permanently?",
                                )
                              ) {
                                const res = await apiCall(
                                  "/api/media",
                                  "DELETE",
                                  { public_id: item.public_id },
                                );
                                if (res) fetchAllData();
                              }
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "4rem",
                      color: "#475569",
                      background: "#1e293b",
                      borderRadius: "1rem",
                      border: "1px dashed #334155",
                    }}
                  >
                    <i
                      className="fas fa-box-open"
                      style={{
                        fontSize: "2.5rem",
                        marginBottom: "1.25rem",
                        display: "block",
                        opacity: 0.5,
                      }}
                    ></i>
                    <p style={{ fontWeight: 600 }}>No media assets found</p>
                    <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      Images uploaded to 'thabo-portfolio' folder will appear
                      here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "skills" &&
            (() => {
              const onSubmit = handleSubmit((data) => {
                const method = isEditing ? "PUT" : "POST";
                const payload = isEditing ? { ...data, id: editId } : data;
                apiCall("/api/skills", method, payload).then(() => resetForm());
              });
              const fullNames = {
                infra: "Infrastructure & Operating Systems",
                virt: "Virtualization & Tools",
                prog: "Programming & Web Technologies",
                db: "Databases",
                sec: "Security & IT Practices",
                soft: "Soft Skills & Leadership",
              };
              return (
                <>
                  <div
                    className="card"
                    style={{
                      position: "relative",
                      zIndex: skillCatOpen ? 100 : 1,
                    }}
                  >
                    <div className="card-title">
                      <i className="fas fa-plus"></i>{" "}
                      {isEditing ? "Edit Skill" : "New Skill"}
                    </div>
                    <form onSubmit={onSubmit}>
                      <div className="grid-2">
                        <div className="input-wrap">
                          <label>Skill Name</label>
                          <input
                            {...register("name", { required: true })}
                            placeholder="e.g. React.js"
                          />
                        </div>
                        <div className="input-wrap">
                          <label>Icon (FontAwesome class)</label>
                          <input
                            placeholder="fab fa-react"
                            {...register("icon")}
                          />
                        </div>
                      </div>
                      <div className="grid-2">
                        <div
                          className="input-wrap"
                          style={{ zIndex: skillCatOpen ? 50 : 1 }}
                        >
                          <label>Category</label>
                          <div className="custom-select-wrapper">
                            <div
                              className={`custom-select-trigger ${skillCatOpen ? "open" : ""}`}
                              onClick={() => setSkillCatOpen(!skillCatOpen)}
                            >
                              <span>
                                {watch("category")
                                  ? {
                                      infra: "Infrastructure & OS",
                                      virt: "Virtualization & Tools",
                                      prog: "Programming & Web",
                                      db: "Databases",
                                      sec: "Security & IT Practices",
                                      soft: "Soft Skills & Leadership",
                                    }[watch("category")]
                                  : "Select Category"}
                              </span>
                              <i
                                className={`fas fa-chevron-down transition-transform duration-200 ${skillCatOpen ? "rotate-180" : ""}`}
                              ></i>
                            </div>
                            <input type="hidden" {...register("category")} />
                            <AnimatePresence>
                              {skillCatOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="custom-select-dropdown"
                                  style={{
                                    position: "absolute",
                                    background: "#1e293b",
                                    width: "100%",
                                    left: 0,
                                    zIndex: 1000,
                                  }}
                                >
                                  {[
                                    {
                                      id: "infra",
                                      name: "Infrastructure & OS",
                                    },
                                    {
                                      id: "virt",
                                      name: "Virtualization & Tools",
                                    },
                                    { id: "prog", name: "Programming & Web" },
                                    { id: "db", name: "Databases" },
                                    {
                                      id: "sec",
                                      name: "Security & IT Practices",
                                    },
                                    {
                                      id: "soft",
                                      name: "Soft Skills & Leadership",
                                    },
                                  ].map((opt) => (
                                    <div
                                      key={opt.id}
                                      className={`custom-select-option ${watch("category") === opt.id ? "selected" : ""}`}
                                      onClick={() => {
                                        setValue("category", opt.id);
                                        setSkillCatOpen(false);
                                      }}
                                    >
                                      {opt.name}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className="input-wrap">
                          <label>Order</label>
                          <input
                            type="number"
                            {...register("order", { valueAsNumber: true })}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                          type="submit"
                          className="btn btn-blue"
                          disabled={loading}
                        >
                          {isEditing ? "Save Changes" : "Add Skill"}
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            className="btn btn-gray"
                            onClick={resetForm}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="card">
                    <div
                      className="card-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <span>
                        <i className="fas fa-list"></i> All Skills by Category
                      </span>
                      <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.4rem 0.75rem",
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "0.5rem",
                          color: "#f1f5f9",
                          width: "200px",
                          outline: "none",
                        }}
                      />
                    </div>
                    {Object.entries(
                      skills
                        .filter((s) =>
                          (s.name || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .reduce((acc, s) => {
                          (acc[s.category || "other"] =
                            acc[s.category || "other"] || []).push(s);
                          return acc;
                        }, {}),
                    )
                      .sort()
                      .map(([cat, items]) => (
                        <div key={cat} style={{ marginBottom: "2rem" }}>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 800,
                              color: "#818cf8",
                              textTransform: "uppercase",
                              letterSpacing: "0.15em",
                              marginBottom: "1rem",
                              paddingBottom: "0.5rem",
                              borderBottom: "1px solid #1e293b",
                            }}
                          >
                            {fullNames[cat] || cat}
                          </div>
                          {items.map((item) => (
                            <div key={item._id} className="item-row">
                              <div className="item-info">
                                <h4
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  {item.name}
                                  {item.status === "draft" && (
                                    <span
                                      style={{
                                        fontSize: "0.6rem",
                                        fontWeight: 800,
                                        color: "#fbbf24",
                                        background: "rgba(251,191,36,0.1)",
                                        border:
                                          "1px solid rgba(251,191,36,0.3)",
                                        borderRadius: "0.3rem",
                                        padding: "0.15rem 0.4rem",
                                        letterSpacing: "0.05em",
                                      }}
                                    >
                                      DRAFT
                                    </span>
                                  )}
                                </h4>
                                <p>
                                  {fullNames[item.category] || item.category}
                                </p>
                              </div>
                              <div className="item-actions">
                                <div
                                  className="action-icon"
                                  title={
                                    item.status === "draft"
                                      ? "Publish"
                                      : "Set as Draft"
                                  }
                                  onClick={() =>
                                    apiCall("/api/skills", "PUT", {
                                      _id: item._id,
                                      status:
                                        item.status === "draft"
                                          ? "published"
                                          : "draft",
                                    })
                                  }
                                  style={{
                                    color:
                                      item.status === "draft"
                                        ? "#fbbf24"
                                        : "#34d399",
                                    background:
                                      item.status === "draft"
                                        ? "rgba(251,191,36,0.08)"
                                        : "rgba(52,211,153,0.08)",
                                  }}
                                >
                                  <i
                                    className={`fas fa-${item.status === "draft" ? "eye-slash" : "eye"}`}
                                  ></i>
                                </div>
                                <div
                                  className="action-icon edit"
                                  onClick={() => startEdit(item)}
                                >
                                  <i className="fas fa-edit"></i>
                                </div>
                                <div
                                  className="action-icon delete"
                                  onClick={() =>
                                    apiCall(
                                      `/api/skills?id=${item._id}`,
                                      "DELETE",
                                    )
                                  }
                                >
                                  <i className="fas fa-trash"></i>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                </>
              );
            })()}

          {/* ── EXPERIENCE TABS ── */}
          {["exp-work", "exp-edu", "exp-ach", "exp-vol"].includes(activeTab) &&
            (() => {
              const typeMap = {
                "exp-work": "work",
                "exp-edu": "education",
                "exp-ach": "achievement",
                "exp-vol": "voluntary",
              };
              const labelMap = {
                "exp-work": "Work History",
                "exp-edu": "Education",
                "exp-ach": "Achievements",
                "exp-vol": "Voluntary",
              };
              const iconMap = {
                "exp-work": "fa-briefcase",
                "exp-edu": "fa-graduation-cap",
                "exp-ach": "fa-trophy",
                "exp-vol": "fa-hand-holding-heart",
              };
              const expType = typeMap[activeTab];
              const label = labelMap[activeTab];
              const filtered = experience.filter(
                (e) => (e.type || "work") === expType,
              );

              const onSubmit = handleSubmit((data) => {
                if (typeof data.description === "string")
                  data.description = data.description
                    .split("\n")
                    .filter((l) => l.trim());
                data.type = expType;
                const method = isEditing ? "PUT" : "POST";
                const payload = isEditing ? { ...data, id: editId } : data;
                apiCall("/api/experience", method, payload).then(() =>
                  resetForm(),
                );
              });

              return (
                <>
                  <div className="card">
                    <div className="card-title">
                      <i className={`fas ${iconMap[activeTab]}`}></i>{" "}
                      {isEditing ? `Edit ${label} Entry` : `Add ${label} Entry`}
                    </div>
                    <form onSubmit={onSubmit}>
                      <div className="grid-2">
                        <div className="input-wrap">
                          <label>
                            {activeTab === "exp-edu"
                              ? "Degree / Qualification"
                              : "Role / Title"}
                          </label>
                          <input
                            {...register("role", { required: true })}
                            placeholder={
                              activeTab === "exp-edu"
                                ? "e.g. B.Sc. in Computer Science"
                                : "e.g. Senior Network Engineer"
                            }
                          />
                        </div>
                        <div className="input-wrap">
                          <label>
                            {activeTab === "exp-edu"
                              ? "Institution"
                              : "Company / Organization"}
                          </label>
                          <input
                            {...register("company", { required: true })}
                            placeholder={
                              activeTab === "exp-edu"
                                ? "e.g. University of Toronto"
                                : "e.g. Global Tech Solutions"
                            }
                          />
                        </div>
                      </div>
                      <div className="grid-2">
                        <div className="input-wrap">
                          <label>Period</label>
                          <input
                            placeholder="e.g., Jan 2022 – Present"
                            {...register("period")}
                          />
                        </div>
                        <div className="input-wrap">
                          <label>Location</label>
                          <input
                            placeholder="e.g., Ontario, Canada"
                            {...register("location")}
                          />
                        </div>
                      </div>
                      <div className="input-wrap">
                        <label>Bullet Points (one per line)</label>
                        <textarea
                          rows="6"
                          placeholder="Enter each responsibility or achievement on a new line..."
                          {...register("description")}
                        />
                      </div>
                      <div className="input-wrap">
                        <label>Order</label>
                        <input
                          type="number"
                          {...register("order", { valueAsNumber: true })}
                          placeholder="0"
                        />
                      </div>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                          type="submit"
                          className="btn btn-blue"
                          disabled={loading}
                        >
                          {isEditing ? "Save Changes" : `Add to ${label}`}
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            className="btn btn-gray"
                            onClick={resetForm}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="card">
                    <div
                      className="card-title"
                      style={{ justifyContent: "space-between" }}
                    >
                      <span>
                        <i className={`fas ${iconMap[activeTab]}`}></i> {label}{" "}
                        Entries
                      </span>
                      <input
                        type="text"
                        placeholder={`Search ${label.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.4rem 0.75rem",
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "0.5rem",
                          color: "#f1f5f9",
                          width: "200px",
                          outline: "none",
                        }}
                      />
                    </div>
                    {filtered.filter(
                      (e) =>
                        (e.role || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        (e.company || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                    ).length > 0 ? (
                      filtered
                        .filter(
                          (e) =>
                            (e.role || "")
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            (e.company || "")
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((item) => (
                          <div
                            key={item._id}
                            className="item-row"
                            style={{
                              opacity: item.status === "draft" ? 0.65 : 1,
                            }}
                          >
                            <div className="item-info">
                              <h4
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                {item.role}
                                {item.status === "draft" && (
                                  <span
                                    style={{
                                      fontSize: "0.6rem",
                                      fontWeight: 800,
                                      color: "#fbbf24",
                                      background: "rgba(251,191,36,0.1)",
                                      border: "1px solid rgba(251,191,36,0.3)",
                                      borderRadius: "0.3rem",
                                      padding: "0.15rem 0.4rem",
                                      letterSpacing: "0.05em",
                                    }}
                                  >
                                    DRAFT
                                  </span>
                                )}
                              </h4>
                              <p>
                                {item.company}
                                {item.period ? ` · ${item.period}` : ""}
                              </p>
                            </div>
                            <div className="item-actions">
                              <div
                                className="action-icon"
                                title={
                                  item.status === "draft"
                                    ? "Publish"
                                    : "Set as Draft"
                                }
                                onClick={() =>
                                  apiCall("/api/experience", "PUT", {
                                    _id: item._id,
                                    status:
                                      item.status === "draft"
                                        ? "published"
                                        : "draft",
                                  })
                                }
                                style={{
                                  color:
                                    item.status === "draft"
                                      ? "#fbbf24"
                                      : "#34d399",
                                  background:
                                    item.status === "draft"
                                      ? "rgba(251,191,36,0.08)"
                                      : "rgba(52,211,153,0.08)",
                                }}
                              >
                                <i
                                  className={`fas fa-${item.status === "draft" ? "eye-slash" : "eye"}`}
                                ></i>
                              </div>
                              <div
                                className="action-icon edit"
                                onClick={() => startEdit(item)}
                              >
                                <i className="fas fa-edit"></i>
                              </div>
                              <div
                                className="action-icon delete"
                                onClick={() =>
                                  apiCall(
                                    `/api/experience?id=${item._id}`,
                                    "DELETE",
                                  )
                                }
                              >
                                <i className="fas fa-trash"></i>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p
                        style={{
                          color: "#475569",
                          textAlign: "center",
                          padding: "2rem",
                        }}
                      >
                        {searchQuery
                          ? `No entries match "${searchQuery}"`
                          : `No ${label} records found. Add your first entry above!`}
                      </p>
                    )}
                  </div>
                </>
              );
            })()}
        </div>
      </main>
      {/* Notification Toast */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`toast ${message.type}`}
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              zIndex: 2000,
              padding: "1rem 2rem",
              borderRadius: "50px",
              background: message.type === "error" ? "#ef4444" : "#10b981",
              color: "white",
              fontWeight: 600,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <i
              className={`fas fa-${message.type === "error" ? "exclamation-circle" : "check-circle"}`}
            ></i>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SKELETON COMPONENTS ──
function CardSkeleton() {
  return (
    <div className="card" style={{ border: "1px solid #1e293b" }}>
      <div
        className="skeleton"
        style={{ width: "40%", height: "1.5rem", marginBottom: "1.5rem" }}
      ></div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="skeleton" style={{ height: "3rem" }}></div>
        <div className="skeleton" style={{ height: "3rem" }}></div>
      </div>
      <div
        className="skeleton"
        style={{ height: "6rem", marginBottom: "1rem" }}
      ></div>
      <div
        className="skeleton"
        style={{ width: "100px", height: "2.5rem" }}
      ></div>
    </div>
  );
}

function ItemRowSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        background: "#1e293b",
        borderRadius: "0.75rem",
        marginBottom: "0.75rem",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          className="skeleton"
          style={{ width: "30%", height: "1rem", marginBottom: "0.5rem" }}
        ></div>
        <div
          className="skeleton"
          style={{ width: "20%", height: "0.75rem" }}
        ></div>
      </div>
      <div className="skeleton" style={{ width: "80px", height: "32px" }}></div>
    </div>
  );
}
