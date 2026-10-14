package rr.seafoods.in.dto;

import java.util.List;

public record AuthResponse(
    String message,
    Long id,
    Long userId,
    String accessToken,
    String username,
    String email,
    String firstName,
    String lastName,
    String name,
    String mobile,
    List<String> roles,
    String role
) {
}