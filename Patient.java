package com.medisync.model;

public class Patient {
    private int    id;
    private String name;
    private int    age;
    private String gender;
    private String disease;
    private int    hospitalId;

    public Patient() {}
    public Patient(int id, String name, int age, String gender, String disease, int hospitalId) {
        this.id = id; this.name = name; this.age = age;
        this.gender = gender; this.disease = disease; this.hospitalId = hospitalId;
    }

    public int    getId()               { return id; }
    public void   setId(int id)         { this.id = id; }
    public String getName()             { return name; }
    public void   setName(String n)     { this.name = n; }
    public int    getAge()              { return age; }
    public void   setAge(int a)         { this.age = a; }
    public String getGender()           { return gender; }
    public void   setGender(String g)   { this.gender = g; }
    public String getDisease()          { return disease; }
    public void   setDisease(String d)  { this.disease = d; }
    public int    getHospitalId()       { return hospitalId; }
    public void   setHospitalId(int h)  { this.hospitalId = h; }
}
