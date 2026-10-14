package rr.seafoods.in.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import rr.seafoods.in.dto.AuthResponse;
import rr.seafoods.in.dto.LoginRequest;
import rr.seafoods.in.dto.RegisterRequest;
import rr.seafoods.in.entity.User;
import rr.seafoods.in.repository.UserRepo;
import rr.seafoods.in.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepo userRepo,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // REGISTER
    public AuthResponse register(RegisterRequest request) {

        if (request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Email and password are required");
        }

        // Confirm password is mandatory during registration
        if (request.confirmpassword() == null
                || !request.password().equals(request.confirmpassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        String email = request.email().trim().toLowerCase();

        if (userRepo.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String username = request.username() != null && !request.username().isBlank()
                ? request.username().trim()
                : email.split("@")[0];

        if (userRepo.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken");
        }

        String firstName = request.firstname() != null
                ? request.firstname().trim() : null;

        String lastName = request.lastname() != null
                ? request.lastname().trim() : null;

        String mobile = request.mobile() != null
                ? request.mobile().trim() : null;

        String displayName = request.name() != null && !request.name().isBlank()
                ? request.name().trim()
                : (firstName != null
                        ? firstName + (lastName != null && !lastName.isBlank()
                                ? " " + lastName : "")
                        : username);

        User user = new User();
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setName(displayName);
        user.setEmail(email);
        user.setMobile(mobile);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ROLE_USER");

        User savedUser = userRepo.save(user);

        String role = savedUser.getRole();
        String token = jwtUtil.generateToken(savedUser.getUsername(), role);

        return new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getId(),
                token,
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getName(),
                savedUser.getMobile(),
                List.of(role),
                role
        );
    }

    // LOGIN
    public AuthResponse login(LoginRequest request) {

        String identifier = request.username() != null
                && !request.username().isBlank()
                ? request.username().trim()
                : (request.email() != null && !request.email().isBlank()
                        ? request.email().trim()
                        : null);

        if (identifier == null) {
            throw new IllegalArgumentException("Username or email is required");
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = userRepo.findByUsernameOrEmail(
                        identifier,
                        identifier.toLowerCase())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid username/email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException(
                    "Invalid username/email or password");
        }

        String role = user.getRole() != null
                ? user.getRole()
                : "ROLE_USER";

        String token = jwtUtil.generateToken(
                user.getUsername() != null
                        ? user.getUsername()
                        : user.getEmail(),
                role);

        return new AuthResponse(
                "Login successful",
                user.getId(),
                user.getId(),
                token,
                user.getUsername() != null
                        ? user.getUsername()
                        : user.getEmail(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getName(),
                user.getMobile(),
                List.of(role),
                role
        );
    }
}
