package rr.seafoods.in.dto;

public record RegisterRequest(
    String username,
    String firstname,
    String lastname,
    String email,
    String mobile,
    String password,
    String confirmpassword,
    String name
) {
}