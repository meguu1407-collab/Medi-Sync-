package com.medisync.dao;

import com.medisync.model.Hospital;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HospitalDAO {

    private final JdbcTemplate jdbc;

    public HospitalDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Hospital> mapper = (rs, rowNum) -> new Hospital(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("location")
    );

    public List<Hospital> getAll() {
        return jdbc.query("SELECT * FROM hospitals ORDER BY name", mapper);
    }

    public Hospital getById(int id) {
        List<Hospital> list = jdbc.query("SELECT * FROM hospitals WHERE id = ?", mapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public boolean add(Hospital h) {
        return jdbc.update("INSERT INTO hospitals (name, location) VALUES (?, ?)",
                h.getName(), h.getLocation()) > 0;
    }

    public boolean delete(int id) {
        return jdbc.update("DELETE FROM hospitals WHERE id = ?", id) > 0;
    }
}
