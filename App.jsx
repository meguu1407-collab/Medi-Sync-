import { useState, useEffect, useCallback } from "react";
import { authAPI, hospitalAPI, doctorAPI, patientAPI, prescriptionAPI } from "./api.js";

/* ─── FONTS & GLOBAL CSS ──────────────────────────────────────────────────── */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:#0B1629; --navy-mid:#132040; --navy-lt:#1A2E55;
    --teal:#00D4B4; --teal-dim:#00A88F; --teal-glow:#00D4B420;
    --amber:#F5A623; --rose:#FF5A7E; --white:#F0F4FF;
    --muted:#8899BB; --border:#1E3060; --card:#111E38; --card-lt:#162240;
    --success:#2ECC8B; --danger:#FF5A7E;
    --font-ui:'Outfit',sans-serif; --font-data:'DM Mono',monospace; --font-head:'DM Serif Display',serif;
  }
  body { font-family:var(--font-ui); background:var(--navy); color:var(--white); min-height:100vh; overflow-x:hidden; }
  ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:var(--navy-mid)} ::-webkit-scrollbar-thumb{background:var(--navy-lt);border-radius:3px} ::-webkit-scrollbar-thumb:hover{background:var(--teal-dim)}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
  .fade-in{animation:fadeIn 0.35s ease forwards}

  /* Layout */
  .app-shell{display:flex;min-height:100vh}
  .sidebar{width:260px;min-height:100vh;background:var(--card);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100}
  .sidebar-logo{padding:28px 24px 20px;border-bottom:1px solid var(--border)}
  .sidebar-logo h1{font-family:var(--font-head);font-size:1.6rem;color:var(--teal);letter-spacing:-0.02em;line-height:1}
  .logo-sub{font-size:0.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.15em;margin-top:4px;font-family:var(--font-data)}
  .sidebar-user{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
  .user-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--teal-dim),var(--navy-lt));display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:600;color:var(--teal);border:1.5px solid var(--teal-dim);flex-shrink:0}
  .user-name{font-size:0.85rem;font-weight:600;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .user-role{font-size:0.7rem;color:var(--teal);font-family:var(--font-data);text-transform:uppercase;letter-spacing:0.1em}
  .sidebar-nav{flex:1;padding:12px;overflow-y:auto}
  .nav-section-label{font-size:0.65rem;font-family:var(--font-data);text-transform:uppercase;letter-spacing:0.15em;color:var(--muted);padding:16px 12px 6px}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:all 0.18s ease;color:var(--muted);font-size:0.875rem;font-weight:500;margin-bottom:2px;border:1px solid transparent;background:none;width:100%;text-align:left}
  .nav-item:hover{background:var(--card-lt);color:var(--white);border-color:var(--border)}
  .nav-item.active{background:var(--teal-glow);color:var(--teal);border-color:#00D4B430}
  .nav-icon{font-size:1rem;width:20px;text-align:center}
  .sidebar-footer{padding:16px 12px;border-top:1px solid var(--border)}
  .main-content{margin-left:260px;flex:1;display:flex;flex-direction:column;min-height:100vh}
  .topbar{height:64px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 32px;gap:16px;position:sticky;top:0;z-index:50}
  .topbar-title{font-size:1.1rem;font-weight:600;color:var(--white);flex:1}
  .topbar-badge{padding:3px 10px;background:var(--teal-glow);color:var(--teal);border:1px solid #00D4B430;border-radius:20px;font-size:0.7rem;font-family:var(--font-data);text-transform:uppercase;letter-spacing:0.1em}
  .page-body{padding:32px;flex:1;animation:fadeIn 0.35s ease}
  .page-header{margin-bottom:28px}
  .page-header h2{font-family:var(--font-head);font-size:2rem;color:var(--white);line-height:1.1;margin-bottom:6px}
  .page-header p{color:var(--muted);font-size:0.875rem}

  /* Stats */
  .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:28px}
  .stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;transition:all 0.2s ease;position:relative;overflow:hidden}
  .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--teal),transparent)}
  .stat-card:hover{border-color:#00D4B430;transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
  .stat-value{font-family:var(--font-data);font-size:2rem;font-weight:500;color:var(--teal);line-height:1;margin-bottom:4px}
  .stat-label{font-size:0.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em}
  .stat-icon{position:absolute;right:16px;top:16px;font-size:1.5rem;opacity:0.3}

  /* Cards */
  .card{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden}
  .card-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .card-title{font-size:0.875rem;font-weight:600;color:var(--white);text-transform:uppercase;letter-spacing:0.06em;font-family:var(--font-data)}
  .card-body{padding:20px}

  /* Table */
  .table-wrapper{overflow-x:auto}
  table{width:100%;border-collapse:collapse;font-size:0.875rem}
  thead th{padding:10px 16px;text-align:left;font-size:0.7rem;font-family:var(--font-data);text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);border-bottom:1px solid var(--border);white-space:nowrap;background:var(--navy-mid)}
  tbody tr{border-bottom:1px solid #1A2A4820;transition:background 0.15s}
  tbody tr:hover{background:var(--card-lt)}
  tbody td{padding:12px 16px;color:var(--white);vertical-align:middle}
  .mono{font-family:var(--font-data);font-size:0.82rem;color:var(--muted)}
  .empty-state{text-align:center;padding:48px;color:var(--muted)}
  .empty-icon{font-size:2.5rem;margin-bottom:12px;opacity:0.4}

  /* Badges */
  .badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:20px;font-size:0.72rem;font-family:var(--font-data);font-weight:500;letter-spacing:0.05em}
  .badge-teal{background:var(--teal-glow);color:var(--teal);border:1px solid #00D4B430}
  .badge-amber{background:#F5A62318;color:var(--amber);border:1px solid #F5A62330}
  .badge-rose{background:#FF5A7E18;color:var(--rose);border:1px solid #FF5A7E30}
  .badge-muted{background:#8899BB18;color:var(--muted);border:1px solid #8899BB30}
  .badge-green{background:#2ECC8B18;color:var(--success);border:1px solid #2ECC8B30}

  /* Buttons */
  .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:8px;font-family:var(--font-ui);font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.18s ease;border:1px solid transparent;white-space:nowrap}
  .btn:disabled{opacity:0.5;cursor:not-allowed}
  .btn-primary{background:var(--teal);color:var(--navy);font-weight:600}
  .btn-primary:hover:not(:disabled){background:#00F0CC;box-shadow:0 4px 16px #00D4B440;transform:translateY(-1px)}
  .btn-outline{background:transparent;color:var(--white);border-color:var(--border)}
  .btn-outline:hover:not(:disabled){border-color:var(--teal);color:var(--teal);background:var(--teal-glow)}
  .btn-danger{background:transparent;color:var(--rose);border-color:#FF5A7E30}
  .btn-danger:hover:not(:disabled){background:#FF5A7E18;border-color:var(--rose)}
  .btn-sm{padding:5px 12px;font-size:0.78rem;border-radius:6px}

  /* Forms */
  .form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
  .form-group{display:flex;flex-direction:column;gap:6px}
  .form-group.full{grid-column:1/-1}
  label{font-size:0.75rem;font-family:var(--font-data);text-transform:uppercase;letter-spacing:0.1em;color:var(--muted)}
  input,select,textarea{background:var(--navy-mid);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--white);font-family:var(--font-ui);font-size:0.875rem;transition:all 0.18s ease;width:100%;outline:none}
  input:focus,select:focus,textarea:focus{border-color:var(--teal-dim);box-shadow:0 0 0 3px var(--teal-glow)}
  input::placeholder,textarea::placeholder{color:var(--muted);opacity:0.7}
  select option{background:var(--navy-mid)}
  textarea{resize:vertical;min-height:80px}
  .search-bar{position:relative;flex:1;max-width:300px}
  .search-bar input{padding-left:36px}
  .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:0.9rem;pointer-events:none}

  /* Modal */
  .modal-overlay{position:fixed;inset:0;background:rgba(11,22,41,0.88);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:24px;animation:fadeIn 0.2s ease}
  .modal{background:var(--card);border:1px solid var(--border);border-radius:16px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;animation:fadeIn 0.25s ease}
  .modal-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .modal-header h3{font-family:var(--font-head);font-size:1.3rem;color:var(--white)}
  .modal-close{background:none;border:none;color:var(--muted);font-size:1.2rem;cursor:pointer;padding:4px;border-radius:4px}
  .modal-close:hover{color:var(--white)}
  .modal-body{padding:24px}
  .modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end}

  /* Login */
  .login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--navy);position:relative;overflow:hidden}
  .login-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 50%,#00D4B408 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 80% 30%,#1A2E5520 0%,transparent 60%);pointer-events:none}
  .login-grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:48px 48px;opacity:0.2;pointer-events:none}
  .login-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:48px 40px;width:100%;max-width:420px;position:relative;z-index:1;animation:fadeIn 0.5s ease;box-shadow:0 40px 80px rgba(0,0,0,0.5)}
  .login-card::before{content:'';position:absolute;top:-1px;left:20%;right:20%;height:2px;background:linear-gradient(90deg,transparent,var(--teal),transparent);border-radius:2px}
  .login-logo{text-align:center;margin-bottom:32px}
  .login-logo h1{font-family:var(--font-head);font-size:2.2rem;color:var(--teal);letter-spacing:-0.03em;line-height:1}
  .login-logo p{color:var(--muted);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.18em;font-family:var(--font-data);margin-top:6px}
  .login-form{display:flex;flex-direction:column;gap:16px}
  .login-hint{text-align:center;margin-top:20px;font-size:0.75rem;color:var(--muted);font-family:var(--font-data);padding:12px;background:var(--navy-mid);border-radius:8px;border:1px solid var(--border);line-height:1.9}

  /* Alerts */
  .alert{padding:12px 16px;border-radius:8px;font-size:0.85rem;display:flex;align-items:center;gap:10px;margin-bottom:16px;animation:slideIn 0.3s ease}
  .alert-success{background:#2ECC8B18;border:1px solid #2ECC8B40;color:var(--success)}
  .alert-error{background:#FF5A7E18;border:1px solid #FF5A7E40;color:var(--rose)}
  .alert-info{background:var(--teal-glow);border:1px solid #00D4B440;color:var(--teal)}

  /* Spinner */
  .spinner{width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--teal);border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block}
  .loading-state{text-align:center;padding:48px;color:var(--muted)}

  /* Analysis bars */
  .analysis-list{display:flex;flex-direction:column;gap:8px}
  .analysis-row{display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--navy-mid);border-radius:8px;border:1px solid var(--border);font-size:0.875rem;transition:background 0.15s}
  .analysis-row:hover{background:var(--card-lt)}
  .analysis-bar-wrap{flex:1;height:6px;background:var(--navy);border-radius:3px;overflow:hidden}
  .analysis-bar{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--teal),var(--teal-dim));transition:width 0.8s ease}
  .analysis-count{font-family:var(--font-data);font-size:0.8rem;color:var(--teal);min-width:24px;text-align:right}

  /* API status */
  .api-status{display:flex;align-items:center;gap:6px;font-size:0.72rem;font-family:var(--font-data);color:var(--muted)}
  .api-dot{width:7px;height:7px;border-radius:50%;background:var(--muted)}
  .api-dot.ok{background:var(--success);box-shadow:0 0 6px var(--success)}
  .api-dot.err{background:var(--rose);box-shadow:0 0 6px var(--rose)}

  @media(max-width:768px){
    .sidebar{width:220px} .main-content{margin-left:220px}
    .page-body{padding:20px} .stats-grid{grid-template-columns:1fr 1fr}
  }
`;

/* ─── UTILITY ────────────────────────────────────────────────────────────── */

function Alert({ type = "info", children, onClose }) {
  return (
    <div className={`alert alert-${type}`}>
      <span>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "1rem" }}>✕</button>
      )}
    </div>
  );
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function Spinner() { return <span className="spinner" />; }

function useAlert() {
  const [alert, setAlert] = useState(null);
  const show = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };
  return [alert, show, () => setAlert(null)];
}

/* ─── LOGIN ──────────────────────────────────────────────────────────────── */

function LoginPage({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    if (!username || !password) { setError("Enter username and password."); return; }
    setLoading(true);
    try {
      const user = await authAPI.login(username, password);
      onLogin(user);
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" /><div className="login-grid" />
      <div className="login-card">
        <div className="login-logo">
          <h1>MediSync</h1>
          <p>Hospital Management System</p>
        </div>
        <div className="login-form">
          {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} placeholder="Enter username"
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} placeholder="Enter password"
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <button className="btn btn-primary" onClick={handleLogin} disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem", marginTop: 4 }}>
            {loading ? <><Spinner /> Authenticating…</> : "Sign In →"}
          </button>
          <button className="btn btn-outline" onClick={onRegister}
            style={{ width: "100%", padding: "10px" }}>
            Create New Account
          </button>
        </div>
        <div className="login-hint">
          <strong style={{ color: "var(--teal)" }}>Default Admin</strong><br />
          username: <strong>admin</strong> &nbsp;·&nbsp; password: <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

/* ─── REGISTER ───────────────────────────────────────────────────────────── */

function RegisterPage({ onBack }) {
  const [form, setForm]     = useState({ username: "", password: "", confirm: "", role: "Patient" });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError(""); }

  async function handleRegister() {
    if (!form.username || !form.password) { setError("All fields required."); return; }
    if (form.password !== form.confirm)   { setError("Passwords don't match."); return; }
    if (form.password.length < 4)         { setError("Password min 4 characters."); return; }
    setLoading(true);
    try {
      await authAPI.register(form.username, form.password, form.role);
      setSuccess(true);
    } catch (e) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div className="login-page">
      <div className="login-bg" /><div className="login-grid" />
      <div className="login-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✓</div>
        <h2 style={{ fontFamily: "var(--font-head)", color: "var(--teal)", marginBottom: 8 }}>Account Created!</h2>
        <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.875rem" }}>
          Your {form.role} account has been created.
        </p>
        <button className="btn btn-primary" onClick={onBack} style={{ width: "100%", padding: "12px" }}>
          Back to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-bg" /><div className="login-grid" />
      <div className="login-card">
        <div className="login-logo"><h1>MediSync</h1><p>Create Account</p></div>
        <div className="login-form">
          {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}
          <div className="form-group"><label>Username</label>
            <input type="text" value={form.username} placeholder="Choose username"
              onChange={e => set("username", e.target.value)} /></div>
          <div className="form-group"><label>Role</label>
            <select value={form.role} onChange={e => set("role", e.target.value)}>
              <option>Patient</option><option>Doctor</option>
              <option>Hospital</option><option>Admin</option>
            </select></div>
          <div className="form-group"><label>Password</label>
            <input type="password" value={form.password} placeholder="Create password"
              onChange={e => set("password", e.target.value)} /></div>
          <div className="form-group"><label>Confirm Password</label>
            <input type="password" value={form.confirm} placeholder="Repeat password"
              onChange={e => set("confirm", e.target.value)} /></div>
          <button className="btn btn-primary" onClick={handleRegister} disabled={loading}
            style={{ width: "100%", padding: "12px", marginTop: 4 }}>
            {loading ? <><Spinner /> Creating…</> : "Create Account →"}
          </button>
          <button className="btn btn-outline" onClick={onBack} style={{ width: "100%", padding: "10px" }}>
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN DASHBOARD ────────────────────────────────────────────────────── */

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, hospitals: 0, doctors: 0, patients: 0, prescriptions: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authAPI.getUsers(),
      hospitalAPI.getAll(),
      doctorAPI.getAll(),
      patientAPI.getAll(),
      prescriptionAPI.getAll(),
    ]).then(([u, h, d, p, rx]) => {
      setStats({ users: u.length, hospitals: h.length, doctors: d.length, patients: p.length, prescriptions: rx.length });
      setUsers(u);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><Spinner /></div>;

  const roleBadge = r => {
    const m = { Admin: "badge-amber", Doctor: "badge-teal", Patient: "badge-rose", Hospital: "badge-muted" };
    return <span className={`badge ${m[r] || "badge-muted"}`}>{r}</span>;
  };

  return (
    <div>
      <div className="page-header"><h2>Admin Dashboard</h2><p>System-wide overview</p></div>
      <div className="stats-grid">
        {[["Users", stats.users, "👤"], ["Hospitals", stats.hospitals, "🏥"],
          ["Doctors", stats.doctors, "🩺"], ["Patients", stats.patients, "🫀"],
          ["Prescriptions", stats.prescriptions, "💊"]].map(([l, v, i]) => (
          <div className="stat-card" key={l}>
            <div className="stat-icon">{i}</div>
            <div className="stat-value">{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">All Users ({users.length})</span></div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Username</th><th>Role</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="mono">{u.id}</td>
                  <td style={{ fontWeight: 500 }}>{u.username}</td>
                  <td>{roleBadge(u.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── HOSPITALS MODULE ───────────────────────────────────────────────────── */

function HospitalsModule() {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors]     = useState([]);
  const [patients, setPatients]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState({ name: "", location: "" });
  const [alert, show, clear]      = useAlert();
  const [saving, setSaving]       = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [h, d, p] = await Promise.all([hospitalAPI.getAll(), doctorAPI.getAll(), patientAPI.getAll()]);
      setHospitals(h); setDoctors(d); setPatients(p);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!form.name) { show("error", "Hospital name is required."); return; }
    setSaving(true);
    try {
      await hospitalAPI.add(form);
      show("success", "Hospital added.");
      setModal(false); setForm({ name: "", location: "" });
      load();
    } catch (e) { show("error", e.message); } finally { setSaving(false); }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await hospitalAPI.delete(id); show("success", "Hospital deleted."); load(); }
    catch (e) { show("error", e.message); }
  }

  if (loading) return <div className="loading-state"><Spinner /></div>;

  return (
    <div>
      <div className="page-header"><h2>Hospitals</h2><p>Registered hospital facilities</p></div>
      {alert && <Alert type={alert.type} onClose={clear}>{alert.msg}</Alert>}

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Add Hospital</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 16 }}>
        {hospitals.map(h => {
          const hd = doctors.filter(d => d.hospitalId === h.id);
          const hp = patients.filter(p => p.hospitalId === h.id);
          return (
            <div key={h.id} className="card">
              <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>🏥</div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", color: "var(--white)", marginBottom: 4 }}>{h.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>📍 {h.location || "—"}</p>
                </div>
                <button className="btn btn-danger btn-sm" style={{ height: "fit-content" }}
                  onClick={() => handleDelete(h.id, h.name)}>✕</button>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", gap: 16, borderTop: "1px solid var(--border)", marginTop: 16 }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: "1.5rem", color: "var(--teal)" }}>{hd.length}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>Doctors</div>
                </div>
                <div style={{ width: 1, background: "var(--border)" }} />
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: "1.5rem", color: "var(--teal)" }}>{hp.length}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>Patients</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title="Add Hospital" onClose={() => setModal(false)}>
          <div className="form-grid">
            <div className="form-group full"><label>Hospital Name</label>
              <input type="text" value={form.name} placeholder="e.g. City General Hospital"
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group full"><label>Location</label>
              <input type="text" value={form.location} placeholder="City, State"
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
          </div>
          <div className="modal-footer" style={{ padding: "16px 0 0", borderTop: "none" }}>
            <button className="btn btn-outline btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={saving}>
              {saving ? <Spinner /> : "Add Hospital"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── DOCTORS MODULE ─────────────────────────────────────────────────────── */

function DoctorsModule() {
  const [doctors, setDoctors]   = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState({ name: "", specialization: "", hospitalId: "" });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [alert, show, clear]    = useAlert();

  async function load() {
    setLoading(true);
    try {
      const [d, h] = await Promise.all([doctorAPI.getAll(), hospitalAPI.getAll()]);
      setDoctors(d); setHospitals(h);
      if (h.length > 0 && !form.hospitalId) setForm(f => ({ ...f, hospitalId: h[0].id }));
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  function hospitalName(id) { return hospitals.find(h => h.id === id)?.name || "—"; }

  async function handleAdd() {
    if (!form.name || !form.specialization) { show("error", "Name and specialization required."); return; }
    setSaving(true);
    try {
      await doctorAPI.add({ ...form, hospitalId: Number(form.hospitalId) });
      show("success", "Doctor added."); setModal(false);
      setForm({ name: "", specialization: "", hospitalId: hospitals[0]?.id || "" });
      load();
    } catch (e) { show("error", e.message); } finally { setSaving(false); }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Remove ${name}?`)) return;
    try { await doctorDAO.delete(id); show("success", "Doctor removed."); load(); }
    catch (e) { show("error", e.message); }
  }

  async function del(id, name) {
    if (!confirm(`Remove ${name}?`)) return;
    try { await doctorAPI.delete(id); show("success", "Doctor removed."); load(); }
    catch (e) { show("error", e.message); }
  }

  if (loading) return <div className="loading-state"><Spinner /></div>;

  return (
    <div>
      <div className="page-header"><h2>Doctor Management</h2><p>Manage doctors and specializations</p></div>
      {alert && <Alert type={alert.type} onClose={clear}>{alert.msg}</Alert>}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Doctors ({filtered.length})</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input value={search} placeholder="Search name or specialization…"
                onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Add Doctor</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Hospital</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">🩺</div><p>No doctors found</p></div></td></tr>
              ) : filtered.map(d => (
                <tr key={d.id}>
                  <td className="mono">{d.id}</td>
                  <td style={{ fontWeight: 500 }}>{d.name}</td>
                  <td><span className="badge badge-teal">{d.specialization}</span></td>
                  <td style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{hospitalName(d.hospitalId)}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => del(d.id, d.name)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Add New Doctor" onClose={() => setModal(false)}>
          <div className="form-grid">
            <div className="form-group"><label>Doctor Name</label>
              <input type="text" value={form.name} placeholder="e.g. Dr. Jane Doe"
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Specialization</label>
              <input type="text" value={form.specialization} placeholder="e.g. Cardiology"
                onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} /></div>
            <div className="form-group full"><label>Hospital</label>
              <select value={form.hospitalId} onChange={e => setForm(f => ({ ...f, hospitalId: e.target.value }))}>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select></div>
          </div>
          <div className="modal-footer" style={{ padding: "16px 0 0", borderTop: "none" }}>
            <button className="btn btn-outline btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={saving}>
              {saving ? <Spinner /> : "Add Doctor"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── PATIENTS MODULE ────────────────────────────────────────────────────── */

function PatientsModule() {
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(null);
  const [histPat, setHistPat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [alert, show, clear]  = useAlert();

  async function load() {
    setLoading(true);
    try {
      const [p, h, rx] = await Promise.all([patientAPI.getAll(), hospitalAPI.getAll(), prescriptionAPI.getAll()]);
      setPatients(p); setHospitals(h); setPrescriptions(rx);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleSearch(val) {
    setSearch(val);
    if (val.trim().length > 1) {
      try { const r = await patientAPI.search(val); setPatients(r); }
      catch (_) {}
    } else if (val === "") {
      try { const r = await patientAPI.getAll(); setPatients(r); }
      catch (_) {}
    }
  }

  function hospitalName(id) { return hospitals.find(h => h.id === id)?.name || "—"; }

  async function savePatient(form) {
    setSaving(true);
    try {
      if (modal === "add") {
        await patientAPI.add(form); show("success", "Patient added.");
      } else {
        await patientAPI.update(modal.id, form); show("success", "Patient updated.");
      }
      setModal(null); load();
    } catch (e) { show("error", e.message); } finally { setSaving(false); }
  }

  async function del(id, name) {
    if (!confirm(`Delete patient "${name}"?`)) return;
    try { await patientAPI.delete(id); show("success", "Patient deleted."); load(); }
    catch (e) { show("error", e.message); }
  }

  function PatientForm({ initial }) {
    const empty = { name: "", age: "", gender: "Male", disease: "", hospitalId: hospitals[0]?.id || "" };
    const [form, setForm2] = useState(initial ? { ...initial, hospitalId: initial.hospitalId } : empty);
    const [err, setErr] = useState("");
    function s(k, v) { setForm2(f => ({ ...f, [k]: v })); setErr(""); }
    function submit() {
      if (!form.name || !form.age || !form.disease) { setErr("Name, age and disease are required."); return; }
      if (isNaN(form.age) || form.age < 0 || form.age > 130) { setErr("Enter valid age."); return; }
      savePatient({ ...form, age: Number(form.age), hospitalId: Number(form.hospitalId) });
    }
    return (
      <>
        {err && <Alert type="error" onClose={() => setErr("")}>{err}</Alert>}
        <div className="form-grid">
          <div className="form-group"><label>Full Name</label>
            <input type="text" value={form.name} placeholder="Patient full name" onChange={e => s("name", e.target.value)} /></div>
          <div className="form-group"><label>Age</label>
            <input type="number" value={form.age} min={0} max={130} onChange={e => s("age", e.target.value)} /></div>
          <div className="form-group"><label>Gender</label>
            <select value={form.gender} onChange={e => s("gender", e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select></div>
          <div className="form-group"><label>Hospital</label>
            <select value={form.hospitalId} onChange={e => s("hospitalId", e.target.value)}>
              {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select></div>
          <div className="form-group full"><label>Disease / Diagnosis</label>
            <input type="text" value={form.disease} placeholder="Primary diagnosis" onChange={e => s("disease", e.target.value)} /></div>
        </div>
        <div className="modal-footer" style={{ padding: "16px 0 0", borderTop: "none" }}>
          <button className="btn btn-outline btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={submit} disabled={saving}>
            {saving ? <Spinner /> : (modal === "add" ? "Add Patient" : "Save Changes")}
          </button>
        </div>
      </>
    );
  }

  if (loading) return <div className="loading-state"><Spinner /></div>;

  const gBadge = g => <span className={`badge ${g === "Female" ? "badge-rose" : "badge-teal"}`}>{g}</span>;

  return (
    <div>
      <div className="page-header"><h2>Patient Management</h2><p>Full patient CRUD with search</p></div>
      {alert && <Alert type={alert.type} onClose={clear}>{alert.msg}</Alert>}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Patients ({patients.length})</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input value={search} placeholder="Search name or disease…"
                onChange={e => handleSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setModal("add")}>+ Add Patient</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Disease</th><th>Hospital</th><th>Actions</th></tr></thead>
            <tbody>
              {patients.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">🔍</div><p>No patients found</p></div></td></tr>
              ) : patients.map(p => (
                <tr key={p.id}>
                  <td className="mono">{p.id}</td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td className="mono">{p.age}</td>
                  <td>{gBadge(p.gender)}</td>
                  <td><span className="badge badge-amber">{p.disease}</span></td>
                  <td style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{hospitalName(p.hospitalId)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setHistPat(p)}>Rx</button>
                      <button className="btn btn-outline btn-sm" onClick={() => setModal(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(p.id, p.name)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add New Patient" : `Edit — ${modal.name}`}
          onClose={() => setModal(null)}>
          <PatientForm initial={modal !== "add" ? modal : null} />
        </Modal>
      )}

      {histPat && (
        <Modal title={`Prescriptions — ${histPat.name}`} onClose={() => setHistPat(null)}>
          <PrescriptionHistory patientId={histPat.id} />
        </Modal>
      )}
    </div>
  );
}

function PrescriptionHistory({ patientId }) {
  const [rxs, setRxs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    prescriptionAPI.getByPatient(patientId).then(setRxs).finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <div className="loading-state"><Spinner /></div>;
  if (rxs.length === 0) return <div className="empty-state"><div className="empty-icon">💊</div><p>No prescriptions</p></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rxs.map(rx => (
        <div key={rx.id} style={{ background: "var(--navy-mid)", borderRadius: 8, border: "1px solid var(--border)", padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 600, color: "var(--teal)" }}>{rx.medicine}</span>
            <span className="mono" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{rx.date}</span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{rx.notes}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── PRESCRIPTIONS MODULE ───────────────────────────────────────────────── */

function PrescriptionsModule() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors]   = useState([]);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [alert, show, clear]    = useAlert();

  async function load() {
    setLoading(true);
    try {
      const [rx, p, d] = await Promise.all([prescriptionAPI.getAll(), patientAPI.getAll(), doctorAPI.getAll()]);
      setPrescriptions(rx); setPatients(p); setDoctors(d);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function patName(id) { return patients.find(p => p.id === id)?.name || "—"; }
  function docName(id) { return doctors.find(d => d.id === id)?.name || "—"; }

  const filtered = prescriptions.filter(rx =>
    patName(rx.patientId).toLowerCase().includes(search.toLowerCase()) ||
    rx.medicine?.toLowerCase().includes(search.toLowerCase())
  );

  function RxForm({ initial }) {
    const empty = {
      patientId: patients[0]?.id || "", doctorId: doctors[0]?.id || "",
      medicine: "", notes: "", date: new Date().toISOString().split("T")[0]
    };
    const [form, setForm2] = useState(initial || empty);
    const [err, setErr] = useState("");
    function s(k, v) { setForm2(f => ({ ...f, [k]: v })); setErr(""); }
    async function submit() {
      if (!form.medicine) { setErr("Medicine is required."); return; }
      const payload = { ...form, patientId: Number(form.patientId), doctorId: Number(form.doctorId) };
      setSaving(true);
      try {
        if (initial) { await prescriptionAPI.update(initial.id, payload); show("success", "Prescription updated."); }
        else { await prescriptionAPI.add(payload); show("success", "Prescription added."); }
        setModal(null); load();
      } catch (e) { setErr(e.message); } finally { setSaving(false); }
    }
    return (
      <>
        {err && <Alert type="error" onClose={() => setErr("")}>{err}</Alert>}
        <div className="form-grid">
          <div className="form-group"><label>Patient</label>
            <select value={form.patientId} onChange={e => s("patientId", e.target.value)}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
          <div className="form-group"><label>Doctor</label>
            <select value={form.doctorId} onChange={e => s("doctorId", e.target.value)}>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select></div>
          <div className="form-group full"><label>Medicine / Treatment</label>
            <input type="text" value={form.medicine} placeholder="e.g. Amoxicillin 500mg"
              onChange={e => s("medicine", e.target.value)} /></div>
          <div className="form-group"><label>Date</label>
            <input type="date" value={form.date} onChange={e => s("date", e.target.value)} /></div>
          <div className="form-group full"><label>Notes</label>
            <textarea value={form.notes} placeholder="Dosage instructions…"
              onChange={e => s("notes", e.target.value)} /></div>
        </div>
        <div className="modal-footer" style={{ padding: "16px 0 0", borderTop: "none" }}>
          <button className="btn btn-outline btn-sm" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={submit} disabled={saving}>
            {saving ? <Spinner /> : (initial ? "Save Changes" : "Add Prescription")}
          </button>
        </div>
      </>
    );
  }

  async function del(id) {
    if (!confirm("Delete this prescription?")) return;
    try { await prescriptionAPI.delete(id); show("success", "Deleted."); load(); }
    catch (e) { show("error", e.message); }
  }

  if (loading) return <div className="loading-state"><Spinner /></div>;

  return (
    <div>
      <div className="page-header"><h2>Prescriptions</h2><p>Create and manage patient prescriptions</p></div>
      {alert && <Alert type={alert.type} onClose={clear}>{alert.msg}</Alert>}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Prescriptions ({filtered.length})</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input value={search} placeholder="Search patient or medicine…" onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setModal("add")}>+ New Rx</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Medicine</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">💊</div><p>No prescriptions</p></div></td></tr>
              ) : filtered.map(rx => (
                <tr key={rx.id}>
                  <td className="mono">{rx.id}</td>
                  <td style={{ fontWeight: 500 }}>{patName(rx.patientId)}</td>
                  <td style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{docName(rx.doctorId)}</td>
                  <td><span className="badge badge-teal">{rx.medicine}</span></td>
                  <td className="mono" style={{ fontSize: "0.8rem" }}>{rx.date}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setModal(rx)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(rx.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <Modal title={modal === "add" ? "New Prescription" : "Edit Prescription"} onClose={() => setModal(null)}>
          <RxForm initial={modal !== "add" ? modal : null} />
        </Modal>
      )}
    </div>
  );
}

/* ─── ANALYSIS MODULE ────────────────────────────────────────────────────── */

function AnalysisModule() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([patientAPI.getAll(), prescriptionAPI.getAll(), doctorAPI.getAll(), hospitalAPI.getAll()])
      .then(([p, rx, d, h]) => { setPatients(p); setPrescriptions(rx); setDoctors(d); setHospitals(h); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><Spinner /></div>;

  const diseaseMap = {};
  patients.forEach(p => { diseaseMap[p.disease] = (diseaseMap[p.disease] || 0) + 1; });
  const diseases = Object.entries(diseaseMap).sort((a, b) => b[1] - a[1]);
  const maxDis = diseases[0]?.[1] || 1;

  const medMap = {};
  prescriptions.forEach(rx => { medMap[rx.medicine] = (medMap[rx.medicine] || 0) + 1; });
  const meds = Object.entries(medMap).sort((a, b) => b[1] - a[1]);
  const maxMed = meds[0]?.[1] || 1;

  const hospStats = hospitals.map(h => ({
    name: h.name,
    patients: patients.filter(p => p.hospitalId === h.id).length,
    doctors: doctors.filter(d => d.hospitalId === h.id).length,
  })).sort((a, b) => b.patients - a.patients);
  const maxH = hospStats[0]?.patients || 1;

  return (
    <div>
      <div className="page-header"><h2>Analysis & Reports</h2><p>Data insights from live database</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))", gap: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Common Diseases</span></div>
          <div className="card-body">
            <div className="analysis-list">
              {diseases.length === 0 ? <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>No data</p>
                : diseases.map(([name, count]) => (
                  <div className="analysis-row" key={name}>
                    <span style={{ flex: 1, fontSize: "0.85rem" }}>{name}</span>
                    <div className="analysis-bar-wrap">
                      <div className="analysis-bar" style={{ width: `${(count / maxDis) * 100}%` }} />
                    </div>
                    <span className="analysis-count">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Top Medicines Prescribed</span></div>
          <div className="card-body">
            <div className="analysis-list">
              {meds.length === 0 ? <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>No data</p>
                : meds.map(([name, count]) => (
                  <div className="analysis-row" key={name}>
                    <span style={{ flex: 1, fontSize: "0.85rem" }}>{name}</span>
                    <div className="analysis-bar-wrap">
                      <div className="analysis-bar" style={{ width: `${(count / maxMed) * 100}%`, background: "linear-gradient(90deg,var(--amber),#E8920F)" }} />
                    </div>
                    <span className="analysis-count" style={{ color: "var(--amber)" }}>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="card" style={{ gridColumn: "1/-1" }}>
          <div className="card-header"><span className="card-title">Hospital Load</span></div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Hospital</th><th>Patients</th><th>Doctors</th><th>Distribution</th></tr></thead>
                <tbody>
                  {hospStats.map(h => (
                    <tr key={h.name}>
                      <td style={{ fontWeight: 500 }}>{h.name}</td>
                      <td className="mono">{h.patients}</td>
                      <td className="mono">{h.doctors}</td>
                      <td style={{ width: "40%" }}>
                        <div className="analysis-bar-wrap" style={{ height: 8 }}>
                          <div className="analysis-bar" style={{ width: `${(h.patients / maxH) * 100}%`, background: "linear-gradient(90deg,var(--rose),#E04066)" }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DOCTOR ROLE VIEW ───────────────────────────────────────────────────── */

function DoctorHomeView({ user }) {
  const [rxs, setRxs]           = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([prescriptionAPI.getAll(), patientAPI.getAll(), doctorAPI.getAll()])
      .then(([rx, p, d]) => { setRxs(rx); setPatients(p); setDoctors(d); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><Spinner /></div>;

  const myDoctor = doctors.find(d => d.name.toLowerCase().includes(user.username.replace("dr.", "").trim()));
  const myRxs = myDoctor ? rxs.filter(r => r.doctorId === myDoctor.id) : rxs.slice(0, 5);
  const myPatientIds = [...new Set(myRxs.map(r => r.patientId))];
  const patName = id => patients.find(p => p.id === id)?.name || "—";

  return (
    <div>
      <div className="page-header">
        <h2>Doctor Dashboard</h2>
        <p>{myDoctor ? `${myDoctor.name} · ${myDoctor.specialization}` : `Welcome, ${user.username}`}</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{myPatientIds.length}</div><div className="stat-label">My Patients</div></div>
        <div className="stat-card"><div className="stat-icon">💊</div><div className="stat-value">{myRxs.length}</div><div className="stat-label">Prescriptions</div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Recent Prescriptions</span></div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Medicine</th><th>Date</th><th>Notes</th></tr></thead>
            <tbody>
              {myRxs.length === 0 ? (
                <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">💊</div><p>No prescriptions</p></div></td></tr>
              ) : myRxs.map(rx => (
                <tr key={rx.id}>
                  <td style={{ fontWeight: 500 }}>{patName(rx.patientId)}</td>
                  <td><span className="badge badge-teal">{rx.medicine}</span></td>
                  <td className="mono" style={{ fontSize: "0.8rem" }}>{rx.date}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{rx.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── PATIENT ROLE VIEW ──────────────────────────────────────────────────── */

function PatientHomeView({ user }) {
  const [rxs, setRxs]       = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    Promise.all([prescriptionAPI.getAll(), doctorAPI.getAll(), patientAPI.getAll()])
      .then(([rx, d, p]) => { setRxs(rx); setDoctors(d); setPatients(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><Spinner /></div>;

  const myPat = patients.find(p => p.name.toLowerCase().includes(user.username.replace("patient", "")) || user.username === "patient1" && p.id === 1);
  const myRxs = myPat ? rxs.filter(rx => rx.patientId === myPat.id) : [];
  const docName = id => doctors.find(d => d.id === id)?.name || "—";

  return (
    <div>
      <div className="page-header">
        <h2>Patient Portal</h2>
        <p>{myPat ? `${myPat.name} · ${myPat.disease}` : `Welcome, ${user.username}`}</p>
      </div>
      {myPat && (
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon">🎂</div><div className="stat-value">{myPat.age}</div><div className="stat-label">Age</div></div>
          <div className="stat-card"><div className="stat-icon">💊</div><div className="stat-value">{myRxs.length}</div><div className="stat-label">Prescriptions</div></div>
          <div className="stat-card"><div className="stat-icon">⚧️</div><div className="stat-value" style={{ fontSize: "1.1rem" }}>{myPat.gender}</div><div className="stat-label">Gender</div></div>
        </div>
      )}
      <div className="card">
        <div className="card-header"><span className="card-title">My Prescriptions</span></div>
        <div className="card-body">
          {myRxs.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">💊</div><p>No prescriptions on record</p></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myRxs.map(rx => (
                <div key={rx.id} style={{ background: "var(--navy-mid)", borderRadius: 10, border: "1px solid var(--border)", padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: "var(--teal)" }}>{rx.medicine}</span>
                    <span className="mono" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{rx.date}</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--white)", marginBottom: 4 }}>{rx.notes}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Prescribed by {docName(rx.doctorId)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── NAV CONFIG ─────────────────────────────────────────────────────────── */

const NAV = {
  Admin:    [
    { id: "overview",      label: "Overview",      icon: "📊" },
    { id: "patients",      label: "Patients",      icon: "🫀" },
    { id: "doctors",       label: "Doctors",       icon: "🩺" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "hospitals",     label: "Hospitals",     icon: "🏥" },
    { id: "analysis",      label: "Analysis",      icon: "📈" },
  ],
  Hospital: [
    { id: "hospitals",     label: "My Hospital",   icon: "🏥" },
    { id: "doctors",       label: "Doctors",       icon: "🩺" },
    { id: "patients",      label: "Patients",      icon: "🫀" },
  ],
  Doctor:   [
    { id: "doctor-home",   label: "Dashboard",     icon: "📊" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "patients",      label: "Patients",      icon: "🫀" },
  ],
  Patient:  [
    { id: "patient-home",  label: "My Health",     icon: "🫀" },
  ],
};

/* ─── APP SHELL ──────────────────────────────────────────────────────────── */

function AppShell({ user, onLogout }) {
  const items = NAV[user.role] || [];
  const [page, setPage] = useState(items[0]?.id || "overview");

  function renderPage() {
    switch (page) {
      case "overview":      return <AdminDashboard />;
      case "patients":      return <PatientsModule />;
      case "doctors":       return <DoctorsModule />;
      case "prescriptions": return <PrescriptionsModule />;
      case "hospitals":     return <HospitalsModule />;
      case "analysis":      return <AnalysisModule />;
      case "doctor-home":   return <DoctorHomeView user={user} />;
      case "patient-home":  return <PatientHomeView user={user} />;
      default:              return <AdminDashboard />;
    }
  }

  const title = items.find(i => i.id === page)?.label || "Dashboard";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>MediSync</h1>
          <div className="logo-sub">Hospital Management</div>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{user.username[0].toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.username}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {items.map(item => (
            <button key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={onLogout} style={{ color: "var(--rose)" }}>
            <span className="nav-icon">⏻</span>Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="topbar-title">{title}</div>
          <span className="topbar-badge">{user.role}</span>
        </div>
        <div className="page-body" key={page}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */

export default function App() {
  const [user, setUser]     = useState(null);
  const [screen, setScreen] = useState("login");

  return (
    <>
      <style>{FONT_LINK}{CSS}</style>
      {user ? (
        <AppShell user={user} onLogout={() => { setUser(null); setScreen("login"); }} />
      ) : screen === "register" ? (
        <RegisterPage onBack={() => setScreen("login")} />
      ) : (
        <LoginPage onLogin={setUser} onRegister={() => setScreen("register")} />
      )}
    </>
  );
}
