package com.heavenhub.dtos;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
@Data
public class UserRegistrationDto {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String phoneNumber;

    /** Optional; when set must be HOST or GUEST */
    @Pattern(regexp = "^(|HOST|GUEST|host|guest)$", message = "Role must be HOST or GUEST")
    private String role;
}
