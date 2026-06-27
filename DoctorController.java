package com.medisync.controller;

import com.medisync.dao.DoctorDAO;
import com.medisync.model.Doctor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorDAO doctorDAO;

    public DoctorController(DoctorDAO doctorDAO) {
        this.doctorDAO = doctorDAO;
    }

    @GetMapping
    public List<Doctor> getAll(@RequestParam(required = false) Integer hospitalId) {
        if (hospitalId != null) return doctorDAO.getByHospital(hospitalId);
        return doctorDAO.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Doctor d = doctorDAO.getById(id);
        return d != null ? ResponseEntity.ok(d) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Doctor d) {
        boolean ok = doctorDAO.add(d);
        return ok ? ResponseEntity.ok(Map.of("message", "Doctor added"))
                  : ResponseEntity.internalServerError().body(Map.of("error", "Failed to add doctor"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        boolean ok = doctorDAO.delete(id);
        return ok ? ResponseEntity.ok(Map.of("message", "Doctor deleted"))
                  : ResponseEntity.notFound().build();
    }
}
