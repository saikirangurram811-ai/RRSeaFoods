package rr.seafoods.in.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import rr.seafoods.in.entity.User;
import rr.seafoods.in.repository.UserRepo;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/userlist")
    public ResponseEntity<List<User>> getUserList() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @GetMapping("/auth/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/auth/settings/{id}")
    public ResponseEntity<?> updateSettings(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        return userRepo.findById(id).map(user -> {
            if (data.containsKey("firstname") && data.get("firstname") != null) {
                user.setFirstName(data.get("firstname").toString().trim());
            }
            if (data.containsKey("lastname") && data.get("lastname") != null) {
                user.setLastName(data.get("lastname").toString().trim());
            }
            if (data.containsKey("email") && data.get("email") != null) {
                user.setEmail(data.get("email").toString().trim().toLowerCase());
            }
            if (data.containsKey("mobile") && data.get("mobile") != null) {
                user.setMobile(data.get("mobile").toString().trim());
            }
            String firstName = user.getFirstName() != null ? user.getFirstName() : "";
            String lastName = user.getLastName() != null ? user.getLastName() : "";
            user.setName((firstName + " " + lastName).trim());
            userRepo.save(user);
            return ResponseEntity.ok(Map.of("message", "Profile settings updated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/auth/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> data) {
        String currentPassword = data.get("currentPassword");
        String newPassword = data.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current and new passwords are required"));
        }

        List<User> users = userRepo.findAll();
        for (User u : users) {
            if (passwordEncoder.matches(currentPassword, u.getPassword())) {
                u.setPassword(passwordEncoder.encode(newPassword));
                userRepo.save(u);
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            }
        }

        return ResponseEntity.badRequest().body(Map.of("message", "Current password does not match our records"));
    }
}

