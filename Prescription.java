package com.medisync.model;

public class Prescription {
    private int    id;
    private int    patientId;
    private int    doctorId;
    private String medicine;
    private String notes;
    private String date;

    public Prescription() {}
    public Prescription(int id, int patientId, int doctorId, String medicine, String notes, String date) {
        this.id = id; this.patientId = patientId; this.doctorId = doctorId;
        this.medicine = medicine; this.notes = notes; this.date = date;
    }

    public int    getId()               { return id; }
    public void   setId(int id)         { this.id = id; }
    public int    getPatientId()        { return patientId; }
    public void   setPatientId(int p)   { this.patientId = p; }
    public int    getDoctorId()         { return doctorId; }
    public void   setDoctorId(int d)    { this.doctorId = d; }
    public String getMedicine()         { return medicine; }
    public void   setMedicine(String m) { this.medicine = m; }
    public String getNotes()            { return notes; }
    public void   setNotes(String n)    { this.notes = n; }
    public String getDate()             { return date; }
    public void   setDate(String d)     { this.date = d; }
}
