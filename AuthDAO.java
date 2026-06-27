package com.medisync.dao;

import com.medisync.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuthDAO {

    private final JdbcTemplate jdbc;

    public AuthDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<User> userMapper = (rs, rowNum) -> new User(
            rs.getInt("id"),
            rs.getString("username"),
            rs.getString("password"),
            rs.getString("role")
    );

    public User login(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        List<User> results = jdbc.query(sql, userMapper, username, password);
        return results.isEmpty() ? null : results.get(0);
    }

    public boolean register(String username, String password, String role) {
        if (usernameExists(username)) return false;
        String sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        return jdbc.update(sql, username, password, role) > 0;
    }

    public boolean usernameExists(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    public List<User> getAllUsers() {
        return jdbc.query("SELECT * FROM users ORDER BY id", userMapper);
    }
}
