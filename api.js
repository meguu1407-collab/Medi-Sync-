// api.js — All REST calls to the Spring Boot backend at /api/*

const BASE = '/api';

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (username, password) => req('POST', '/auth/login', { username, password }),
  register: (username, password, role) => req('POST', '/auth/register', { username, password, role }),
  getUsers: () => req('GET', '/auth/users'),
};

// ── Hospitals ────────────────────────────────────────────────────────────────
export const hospitalAPI = {
  getAll:  ()    => req('GET',    '/hospitals'),
  getById: (id)  => req('GET',    `/hospitals/${id}`),
  add:     (h)   => req('POST',   '/hospitals', h),
  delete:  (id)  => req('DELETE', `/hospitals/${id}`),
};

// ── Doctors ──────────────────────────────────────────────────────────────────
export const doctorAPI = {
  getAll:        ()           => req('GET',    '/doctors'),
  getByHospital: (hospitalId) => req('GET',    `/doctors?hospitalId=${hospitalId}`),
  add:           (d)          => req('POST',   '/doctors', d),
  delete:        (id)         => req('DELETE', `/doctors/${id}`),
};

// ── Patients ─────────────────────────────────────────────────────────────────
export const patientAPI = {
  getAll:        ()           => req('GET',    '/patients'),
  getByHospital: (hospitalId) => req('GET',    `/patients?hospitalId=${hospitalId}`),
  search:        (keyword)    => req('GET',    `/patients?search=${encodeURIComponent(keyword)}`),
  getById:       (id)         => req('GET',    `/patients/${id}`),
  add:           (p)          => req('POST',   '/patients', p),
  update:        (id, p)      => req('PUT',    `/patients/${id}`, p),
  delete:        (id)         => req('DELETE', `/patients/${id}`),
};

// ── Prescriptions ─────────────────────────────────────────────────────────────
export const prescriptionAPI = {
  getAll:       ()          => req('GET',    '/prescriptions'),
  getByPatient: (patientId) => req('GET',    `/prescriptions?patientId=${patientId}`),
  getByDoctor:  (doctorId)  => req('GET',    `/prescriptions?doctorId=${doctorId}`),
  add:          (rx)        => req('POST',   '/prescriptions', rx),
  update:       (id, rx)    => req('PUT',    `/prescriptions/${id}`, rx),
  delete:       (id)        => req('DELETE', `/prescriptions/${id}`),
};
