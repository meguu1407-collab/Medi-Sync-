package com.medisync.controller;

import com.medisync.dao.HospitalDAO;
import com.medisync.model.Hospital;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalDAO hospitalDAO;

    public HospitalController(HospitalDAO hospitalDAO) {
        this.hospitalDAO = hospitalDAO;
    }

    @GetMapping
    public List<Hospital> getAll() {
        return hospitalDAO.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Hospital h = hospitalDAO.getById(id);
        return h != null ? ResponseEntity.ok(h) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Hospital h) {
        boolean ok = hospitalDAO.add(h);
        return ok ? ResponseEntity.ok(Map.of("message", "Hospital added"))
                  : ResponseEntity.internalServerError().body(Map.of("error", "Failed to add hospital"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        boolean ok = hospitalDAO.delete(id);
        return ok ? ResponseEntity.ok(Map.of("message", "Hospital deleted"))
                  : ResponseEntity.notFound().build();
    }
}
