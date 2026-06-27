package com.medisync.controller;

import com.medisync.dao.PrescriptionDAO;
import com.medisync.model.Prescription;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionDAO prescriptionDAO;

    public PrescriptionController(PrescriptionDAO prescriptionDAO) {
        this.prescriptionDAO = prescriptionDAO;
    }

    @GetMapping
    public List<Prescription> getAll(
            @RequestParam(required = false) Integer patientId,
            @RequestParam(required = false) Integer doctorId) {
        if (patientId != null) return prescriptionDAO.getByPatient(patientId);
        if (doctorId  != null) return prescriptionDAO.getByDoctor(doctorId);
        return prescriptionDAO.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Prescription p = prescriptionDAO.getById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Prescription p) {
        boolean ok = prescriptionDAO.add(p);
        return ok ? ResponseEntity.ok(Map.of("message", "Prescription added"))
                  : ResponseEntity.internalServerError().body(Map.of("error", "Failed to add prescription"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Prescription p) {
        p.setId(id);
        boolean ok = prescriptionDAO.update(p);
        return ok ? ResponseEntity.ok(Map.of("message", "Prescription updated"))
                  : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        boolean ok = prescriptionDAO.delete(id);
        return ok ? ResponseEntity.ok(Map.of("message", "Prescription deleted"))
                  : ResponseEntity.notFound().build();
    }
}
