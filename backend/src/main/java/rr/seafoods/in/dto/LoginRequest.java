package rr.seafoods.in.dto;

public record LoginRequest(
    String username,
    String email,
    String password
) {
}