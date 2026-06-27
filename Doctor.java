package com.medisync.model;

public class Doctor {
    private int    id;
    private String name;
    private String specialization;
    private int    hospitalId;

    public Doctor() {}
    public Doctor(int id, String name, String specialization, int hospitalId) {
        this.id = id; this.name = name;
        this.specialization = specialization; this.hospitalId = hospitalId;
    }

    public int    getId()                       { return id; }
    public void   setId(int id)                 { this.id = id; }
    public String getName()                     { return name; }
    public void   setName(String n)             { this.name = n; }
    public String getSpecialization()           { return specialization; }
    public void   setSpecialization(String s)   { this.specialization = s; }
    public int    getHospitalId()               { return hospitalId; }
    public void   setHospitalId(int hid)        { this.hospitalId = hid; }
}
