package com.example.controller;

import com.example.entities.Student;
import com.example.services.StudentService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/login")
public class Login extends HttpServlet {
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private final StudentService studentService = new StudentService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject jsonRequest = gson.fromJson(req.getReader(), JsonObject.class);
        String reg_no = jsonRequest.get("reg_no").getAsString();
        String password = jsonRequest.get("password").getAsString();

        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        try {
            Student student = studentService.findByRegNoAndPassword(reg_no, password);
            if (student != null) {
                String jsonResponse = gson.toJson(student);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write(jsonResponse);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("success", "false");
                response.put("message", "Invalid email or password");
                String jsonResponse = gson.toJson(response);
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write(jsonResponse);
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> response = new HashMap<>();
            response.put("success", "false");
            response.put("message", "An error occurred during login");
            String jsonResponse = new Gson().toJson(response);
            resp.getWriter().write(jsonResponse);
            e.printStackTrace();
        }
    }
}
