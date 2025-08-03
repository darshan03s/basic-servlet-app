package com.example.services;

import com.example.entities.Student;
import com.example.repository.StudentRepository;

public class StudentService {
    private final StudentRepository studentRepository = new StudentRepository();

    public void registerStudent(Student student) {
        studentRepository.save(student);
    }

    public Student findByRegNoAndPassword(String reg_no, String password) throws Exception {
        return studentRepository.findByRegNoAndPassword(reg_no, password);
    }

    public Student findByRegNo(String reg_no) throws Exception {
        return studentRepository.findByRegNo(reg_no);
    }
}
