package org.example.services.user;

import lombok.RequiredArgsConstructor;
import org.example.dtos.user.UserLoginDTO;
import org.example.dtos.user.UserRegisterDTO;
import org.example.mappers.user.UserMapper;
import org.example.repositories.role.IRoleRepository;
import org.example.repositories.user.IUserRepository;
import org.example.services.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final IRoleRepository roleRepository;

    public String register(UserRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            return null;
        }
        var password = dto.getPassword();
        var confirmPassword = dto.getConfirmPassword();
        if (!confirmPassword.equals(password)) {
            return null;
        }
        var user = userMapper.fromRegisterDTO(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        var roleOpt = roleRepository.findByName("USER");
        if (roleOpt.isEmpty()) return null;
        var role = roleOpt.get();
        user.getRoles().add(role);
        userRepository.save(user);
        return jwtService.generateAccessToken(user);
    }


    public String login(UserLoginDTO dto) {
        var userOptEmail = userRepository.findByEmail(dto.getLogin());
        var userOptUsername = userRepository.findByUsername(dto.getLogin());
        if (userOptEmail.isPresent()) {
            var user = userOptEmail.get();
            var password = user.getPassword();
            if (passwordEncoder.matches(dto.getPassword(), password)) {
                return jwtService.generateAccessToken(user);
            } else {
                return null;
            }
        } else if (userOptUsername.isPresent()) {
            var user = userOptUsername.get();
            var password = user.getPassword();
            if (passwordEncoder.matches(dto.getPassword(), password)) {
                return jwtService.generateAccessToken(user);
            } else {
                return null;
            }
        } else {
            return null;
        }

    }

    public boolean validateToken(String token) {
        return jwtService.validate(token);
    }
}
