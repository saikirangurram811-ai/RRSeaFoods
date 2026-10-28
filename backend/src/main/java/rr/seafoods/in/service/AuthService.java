package rr.seafoods.in.service;

import java.util.List;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import rr.seafoods.in.dto.AuthResponse;
import rr.seafoods.in.dto.LoginRequest;
import rr.seafoods.in.dto.RegisterRequest;
import rr.seafoods.in.entity.User;
import rr.seafoods.in.repository.UserRepo;
import rr.seafoods.in.security.JwtUtil;

@Service
@Transactional
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

    // ================= REGISTER =================

    public AuthResponse register(RegisterRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Registration details are required");
        }

        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        if (request.confirmpassword() != null && !request.confirmpassword().isBlank()
                && !request.password().equals(request.confirmpassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepo.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String username;
        if (request.username() != null && !request.username().isBlank()) {
            username = request.username().trim();
        } else {
            username = email.substring(0, email.indexOf('@'));
        }

        if (userRepo.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken");
        }

        String firstName = clean(request.firstname());
        String lastName = clean(request.lastname());
        String mobile = clean(request.mobile());
        String displayName = clean(request.name());

        if (displayName == null) {
            if (firstName != null) {
                displayName = firstName + (lastName != null ? " " + lastName : "");
            } else {
                displayName = username;
            }
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setName(displayName);
        user.setMobile(mobile);
        user.setRole("ROLE_USER");

        User savedUser = userRepo.save(user);

        return createAuthResponse(savedUser, "Registration successful");
    }

    // ================= LOGIN =================

    public AuthResponse login(LoginRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Login details are required");
        }

        String username = clean(request.username());
        String email = clean(request.email());
        String password = request.password();

        if ((username == null || username.isBlank()) && (email == null || email.isBlank())) {
            throw new IllegalArgumentException("Username or email is required");
        }

        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        // Prefer username if provided; otherwise use email.
        String identifier = (username != null && !username.isBlank()) ? username : email;

        User user = userRepo.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username/email or password"));

        // Verify password against BCrypt hash, or support plain text fallback for initial test records
        boolean passwordMatches = (user.getPassword() != null) &&
                (passwordEncoder.matches(password, user.getPassword()) || password.equals(user.getPassword()));

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid username/email or password");
        }

        // If the password was plain text, automatically upgrade to BCrypt hash
        if (password.equals(user.getPassword()) && !user.getPassword().startsWith("$2")) {
            user.setPassword(passwordEncoder.encode(password));
            userRepo.save(user);
        }

        return createAuthResponse(user, "Login successful");
    }

    private AuthResponse createAuthResponse(User user, String message) {

        String role = user.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        }

        String principal = user.getUsername();
        if (principal == null || principal.isBlank()) {
            principal = user.getEmail();
        }

        if (principal == null || principal.isBlank()) {
            throw new IllegalStateException("User has no username or email");
        }

        String token = jwtUtil.generateToken(principal, role);

        return new AuthResponse(
                message,
                user.getId(),
                user.getId(),
                token,
                principal,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getName(),
                user.getMobile(),
                List.of(role),
                role
        );
    }

    // ================= HELPER =================

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
