package com.medisync.controller;

import com.medisync.dao.PatientDAO;
import com.medisync.model.Patient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientDAO patientDAO;

    public PatientController(PatientDAO patientDAO) {
        this.patientDAO = patientDAO;
    }

    @GetMapping
    public List<Patient> getAll(
            @RequestParam(required = false) Integer hospitalId,
            @RequestParam(required = false) String  search) {
        if (search != null && !search.isBlank()) return patientDAO.search(search);
        if (hospitalId != null) return patientDAO.getByHospital(hospitalId);
        return patientDAO.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Patient p = patientDAO.getById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Patient p) {
        boolean ok = patientDAO.add(p);
        return ok ? ResponseEntity.ok(Map.of("message", "Patient added"))
                  : ResponseEntity.internalServerError().body(Map.of("error", "Failed to add patient"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Patient p) {
        p.setId(id);
        boolean ok = patientDAO.update(p);
        return ok ? ResponseEntity.ok(Map.of("message", "Patient updated"))
                  : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        boolean ok = patientDAO.delete(id);
        return ok ? ResponseEntity.ok(Map.of("message", "Patient deleted"))
                  : ResponseEntity.notFound().build();
    }
}
