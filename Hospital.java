package com.medisync.model;

public class Hospital {
    private int    id;
    private String name;
    private String location;

    public Hospital() {}
    public Hospital(int id, String name, String location) {
        this.id = id; this.name = name; this.location = location;
    }

    public int    getId()               { return id; }
    public void   setId(int id)         { this.id = id; }
    public String getName()             { return name; }
    public void   setName(String n)     { this.name = n; }
    public String getLocation()         { return location; }
    public void   setLocation(String l) { this.location = l; }
}
