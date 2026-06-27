package com.medisync.controller;

import com.medisync.dao.AuthDAO;
import com.medisync.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthDAO authDAO;

    public AuthController(AuthDAO authDAO) {
        this.authDAO = authDAO;
    }

    /** POST /api/auth/login — body: { username, password } */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "username and password required"));
        }

        User user = authDAO.login(username, password);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        // Return user without password
        return ResponseEntity.ok(Map.of(
                "id",       user.getId(),
                "username", user.getUsername(),
                "role",     user.getRole()
        ));
    }

    /** POST /api/auth/register — body: { username, password, role } */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String role     = body.get("role");

        if (username == null || password == null || role == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "username, password, role required"));
        }

        boolean success = authDAO.register(username, password, role);
        if (!success) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    /** GET /api/auth/users — returns all users (admin only in production) */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        List<User> users = authDAO.getAllUsers();
        // Strip passwords
        users.forEach(u -> u.setPassword(null));
        return users;
    }
}
