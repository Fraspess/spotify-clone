package org.example.services;

import lombok.RequiredArgsConstructor;
import org.example.dtos.UserLoginDTO;
import org.example.dtos.UserRegisterDTO;
import org.example.mappers.UserMapper;
import org.example.repositories.IUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(UserRegisterDTO dto){
        if (userRepository.existsByEmail(dto.getEmail())) {
            return null;
        }
        var password = dto.getPassword();
        var confirmPassword = dto.getConfirmPassword();
        if (!confirmPassword.equals(password)){
            return null;
        }
        var user = userMapper.fromRegisterDTO(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        userRepository.save(user);
        return jwtService.generateAccessToken(user);
    }


    public String login(UserLoginDTO dto){
        var userOpt = userRepository.findByEmail(dto.getEmail());
        if (userOpt.isEmpty()){
            return  null;
        }
        var user = userOpt.get();
        var password = user.getPassword();
        if(passwordEncoder.matches(dto.getPassword(), password)){
            return jwtService.generateAccessToken(user);
        }
        else{
            return null;
        }

    }

    public boolean validateToken(String token){
        return jwtService.validate(token);
    }
}
