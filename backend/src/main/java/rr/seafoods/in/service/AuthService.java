package rr.seafoods.in.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import rr.seafoods.in.dto.AuthResponse;
import rr.seafoods.in.dto.LoginRequest;
import rr.seafoods.in.dto.RegisterRequest;
import rr.seafoods.in.entity.User;
import rr.seafoods.in.repository.UserRepo;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepo userRepo,
            PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {

        if (request.name() == null || request.name().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException(
                    "Name, email and password are required");
        }

        String email = request.email().trim().toLowerCase();

        if (userRepo.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email is already registered");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));

        User savedUser = userRepo.save(user);

        return new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {

        if (request.email() == null || request.email().isBlank()
                || request.password() == null
                || request.password().isBlank()) {
            throw new IllegalArgumentException(
                    "Email and password are required");
        }

        String email = request.email().trim().toLowerCase();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid email or password"));

        if (!passwordEncoder.matches(
                request.password(), user.getPassword())) {
            throw new IllegalArgumentException(
                    "Invalid email or password");
        }

        return new AuthResponse(
                "Login successful",
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}