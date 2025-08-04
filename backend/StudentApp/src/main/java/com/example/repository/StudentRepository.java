package com.example.repository;

import com.example.entities.Student;
import com.example.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

public class StudentRepository {
    private static final SessionFactory sessionFactory = HibernateUtil.getSessionFactory();

    public void save(Student student) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            session.persist(student);
            session.getTransaction().commit();
        }
    }

    public Student findByRegNoAndPassword(String reg_no, String password) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                            "FROM Student WHERE reg_no = :reg_no AND password = :password", Student.class)
                    .setParameter("reg_no", reg_no)
                    .setParameter("password", password)
                    .uniqueResult();
        }
    }

    public Student findByRegNo(String reg_no) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                            "FROM Student WHERE reg_no = :reg_no", Student.class)
                    .setParameter("reg_no", reg_no)
                    .uniqueResult();
        }
    }
}