package com.heavenhub.services.impl;

import com.heavenhub.dtos.LoginRequestDto;
import com.heavenhub.dtos.UserDto;
import com.heavenhub.dtos.UserRegistrationDto;
import com.heavenhub.exceptions.ResourceNotFoundException;
import com.heavenhub.models.Role;
import com.heavenhub.models.TrustScore;
import com.heavenhub.models.User;
import com.heavenhub.repositories.UserRepository;
import com.heavenhub.services.UserService;
import com.heavenhub.utils.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto registerUser(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getRole() != null && !dto.getRole().isBlank()) {
            user.setRole(Role.valueOf(dto.getRole().trim().toUpperCase()));
        } else {
            user.setRole(Role.GUEST);
        }

        TrustScore trustScore = new TrustScore();
        trustScore.setUser(user);
        user.setTrustScore(trustScore);

        User savedUser = userRepository.save(user);
        return dtoMapper.toUserDto(savedUser);
    }

    @Override
    public UserDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        return dtoMapper.toUserDto(user);
    }

    @Override
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return dtoMapper.toUserDto(user);
    }
}
