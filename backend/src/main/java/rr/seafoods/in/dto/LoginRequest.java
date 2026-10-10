package rr.seafoods.in.dto;

public record LoginRequest(
    String email,
    String password
) {
}