package com.internship.tool.controller;

import com.internship.tool.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // Simple in-memory user store for now (will be replaced with DB later)
    private final Map<String, String> users = new ConcurrentHashMap<>();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password required"));
        }
        if (users.containsKey(username)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "User already exists"));
        }

        users.put(username, passwordEncoder.encode(password));
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (!users.containsKey(username)) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid credentials"));
        }
        if (!passwordEncoder.matches(password, users.get(username))) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "No token provided"));
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid token"));
        }
        String username = jwtUtil.extractUsername(token);
        String newToken = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", newToken));
    }
}