package com.medisync.dao;

import com.medisync.model.Prescription;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PrescriptionDAO {

    private final JdbcTemplate jdbc;

    public PrescriptionDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Prescription> mapper = (rs, rowNum) -> new Prescription(
            rs.getInt("id"),
            rs.getInt("patient_id"),
            rs.getInt("doctor_id"),
            rs.getString("medicine"),
            rs.getString("notes"),
            rs.getString("date")
    );

    public List<Prescription> getAll() {
        return jdbc.query("SELECT * FROM prescriptions ORDER BY date DESC", mapper);
    }

    public List<Prescription> getByPatient(int patientId) {
        return jdbc.query(
                "SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY date DESC",
                mapper, patientId);
    }

    public List<Prescription> getByDoctor(int doctorId) {
        return jdbc.query(
                "SELECT * FROM prescriptions WHERE doctor_id = ? ORDER BY date DESC",
                mapper, doctorId);
    }

    public Prescription getById(int id) {
        List<Prescription> list = jdbc.query(
                "SELECT * FROM prescriptions WHERE id = ?", mapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public boolean add(Prescription p) {
        return jdbc.update(
                "INSERT INTO prescriptions (patient_id, doctor_id, medicine, notes, date) VALUES (?,?,?,?,?)",
                p.getPatientId(), p.getDoctorId(), p.getMedicine(), p.getNotes(), p.getDate()) > 0;
    }

    public boolean update(Prescription p) {
        return jdbc.update(
                "UPDATE prescriptions SET patient_id=?, doctor_id=?, medicine=?, notes=?, date=? WHERE id=?",
                p.getPatientId(), p.getDoctorId(), p.getMedicine(), p.getNotes(), p.getDate(), p.getId()) > 0;
    }

    public boolean delete(int id) {
        return jdbc.update("DELETE FROM prescriptions WHERE id = ?", id) > 0;
    }
}
