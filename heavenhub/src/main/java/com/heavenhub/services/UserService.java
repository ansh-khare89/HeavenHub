package com.heavenhub.services;
import com.heavenhub.dtos.LoginRequestDto;
import com.heavenhub.dtos.UserDto;
import com.heavenhub.dtos.UserRegistrationDto;

public interface UserService {
    UserDto registerUser(UserRegistrationDto registrationDto);

    UserDto login(LoginRequestDto dto);

    UserDto getUserById(Long userId);
}
