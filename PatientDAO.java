package com.medisync.dao;

import com.medisync.model.Patient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PatientDAO {

    private final JdbcTemplate jdbc;

    public PatientDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Patient> mapper = (rs, rowNum) -> new Patient(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getInt("age"),
            rs.getString("gender"),
            rs.getString("disease"),
            rs.getInt("hospital_id")
    );

    public List<Patient> getAll() {
        return jdbc.query("SELECT * FROM patients ORDER BY name", mapper);
    }

    public List<Patient> getByHospital(int hospitalId) {
        return jdbc.query("SELECT * FROM patients WHERE hospital_id = ? ORDER BY name", mapper, hospitalId);
    }

    public Patient getById(int id) {
        List<Patient> list = jdbc.query("SELECT * FROM patients WHERE id = ?", mapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<Patient> search(String keyword) {
        String like = "%" + keyword + "%";
        return jdbc.query(
                "SELECT * FROM patients WHERE name LIKE ? OR disease LIKE ? ORDER BY name",
                mapper, like, like);
    }

    public boolean add(Patient p) {
        return jdbc.update(
                "INSERT INTO patients (name, age, gender, disease, hospital_id) VALUES (?,?,?,?,?)",
                p.getName(), p.getAge(), p.getGender(), p.getDisease(), p.getHospitalId()) > 0;
    }

    public boolean update(Patient p) {
        return jdbc.update(
                "UPDATE patients SET name=?, age=?, gender=?, disease=?, hospital_id=? WHERE id=?",
                p.getName(), p.getAge(), p.getGender(), p.getDisease(), p.getHospitalId(), p.getId()) > 0;
    }

    public boolean delete(int id) {
        return jdbc.update("DELETE FROM patients WHERE id = ?", id) > 0;
    }
}
