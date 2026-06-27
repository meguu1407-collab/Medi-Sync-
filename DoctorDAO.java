package com.medisync.dao;

import com.medisync.model.Doctor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DoctorDAO {

    private final JdbcTemplate jdbc;

    public DoctorDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Doctor> mapper = (rs, rowNum) -> new Doctor(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("specialization"),
            rs.getInt("hospital_id")
    );

    public List<Doctor> getAll() {
        return jdbc.query("SELECT * FROM doctors ORDER BY name", mapper);
    }

    public List<Doctor> getByHospital(int hospitalId) {
        return jdbc.query("SELECT * FROM doctors WHERE hospital_id = ? ORDER BY name", mapper, hospitalId);
    }

    public Doctor getById(int id) {
        List<Doctor> list = jdbc.query("SELECT * FROM doctors WHERE id = ?", mapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public boolean add(Doctor d) {
        return jdbc.update(
                "INSERT INTO doctors (name, specialization, hospital_id) VALUES (?, ?, ?)",
                d.getName(), d.getSpecialization(), d.getHospitalId()) > 0;
    }

    public boolean delete(int id) {
        return jdbc.update("DELETE FROM doctors WHERE id = ?", id) > 0;
    }
}
