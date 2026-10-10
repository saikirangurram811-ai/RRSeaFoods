package rr.seafoods.in.dto;

public record RegisterRequest(
    String name,
    String email,
    String password
) {
}