package rr.seafoods.in.dto;

public record AuthResponse(
    String message,
    Long userId,
    String name,
    String email
) {
}