package com.example.knowledgebase.controller;

import com.example.knowledgebase.dto.*;
import com.example.knowledgebase.model.User;
import com.example.knowledgebase.security.JwtUtil;
import com.example.knowledgebase.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        System.out.println("Register attempt: " + req.getEmail());
        if (userService.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body(java.util.Map.of("message", "User already exists"));
        }
        User user = userService.register(req.getName(), req.getEmail(), req.getPassword());
        String token = jwtUtil.generateToken(user.getId());
        AuthResponse resp = new AuthResponse();
        resp.setToken(token);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return userService.authenticate(req.getEmail(), req.getPassword())
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getId());
                    AuthResponse resp = new AuthResponse();
                    resp.setToken(token);
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.status(401).build());
    }
} 