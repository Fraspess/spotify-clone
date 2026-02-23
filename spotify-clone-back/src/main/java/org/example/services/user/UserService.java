package org.example.services.user;

import lombok.RequiredArgsConstructor;
import org.example.dtos.user.*;
import org.example.entities.user.UserEntity;
import org.example.mappers.user.UserMapper;
import org.example.repositories.role.IRoleRepository;
import org.example.repositories.song.ISongRepository;
import org.example.repositories.user.IUserRepository;
import org.example.services.jwt.JwtService;
import org.example.services.smtp.SmtpService;
import org.example.utils.AuthService;
import org.example.utils.ImagesService;
import org.example.utils.smtp.EmailMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final IRoleRepository roleRepository;
    private final ImagesService userImagesService;
    private final AuthService authService;

    @Value("${user.images.dir}")
    private String uploadImgDir;

    @Value("${frontend.url}")
    private String frontEndUrl;

    public Map<String, String> register(UserRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Почта занята");
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Юзернейм вже зайнятий");
        }
        var user = userMapper.fromRegisterDTO(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        var role = roleRepository.findByName("USER").orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Нема ролі юзер????"));
        user.getRoles().add(role);
        userRepository.save(user);
        return jwtService.generateRefreshAccessTokens(user);
    }


    public Map<String, String> login(UserLoginDTO dto) {
        var userOpt = userRepository.findByEmail(dto.getLogin())
                .or(() -> userRepository.findByUsername(dto.getLogin()));
        var user = userOpt.orElseThrow(() -> new IllegalArgumentException("Невірний логін або пароль"));
        var password = user.getPassword();
        if (passwordEncoder.matches(dto.getPassword(), password)) {
            return jwtService.generateRefreshAccessTokens(user);
        } else {
            throw new IllegalArgumentException("Невірний логін або пароль");
        }
    }

    public void disable() {
        var user = authService.getUser();
        userRepository.deleteById(user.getId());
    }


    public void update(UserUpdateDTO dto) {
        var user = authService.getUser();

        if (dto.getUsername() != null && !dto.getUsername().isEmpty()) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        if (dto.getUserImage() != null && !dto.getUserImage().isEmpty()) {
            var fileName = userImagesService.load(dto.getUserImage(), uploadImgDir);
            user.setImage(fileName);
        }
        userRepository.save(user);
    }

    public List<GetAllUsersDTO> getAll() {
        var users = userRepository.findAll();
        return userMapper.fromEntityGetAll(users);
    }

    public UserResponseDTO getByUsername(String username) {
        var userOpt = userRepository.findByUsername(username);
        return userMapper.fromEntity(userOpt.orElseThrow(() -> new IllegalArgumentException("Юзера не знайдено")));
    }

    public UserResponseDTO getById(Long id){
        return userMapper.fromEntity(userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Юзера не знайдено")));
    }

    public Map<String, String> refresh(String refresh) {
        return jwtService.refreshAccessToken(refresh);
    }


    public Map<String,String> googleAuth(String email, String imageUrl){
        var userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()){
            var newUser = new UserEntity();
            newUser.setEmail(email);
            newUser.setUsername(email.split("@")[0]);

            var userRole = roleRepository.findByName("USER").orElseThrow(() -> new IllegalArgumentException("Немає ролі юзер????"));
            newUser.getRoles().add(userRole);
            userRepository.save(newUser);
            userImagesService.load(imageUrl, uploadImgDir);
            return jwtService.generateRefreshAccessTokens(newUser);
        }else{
            var user = userOpt.get();
            return jwtService.generateRefreshAccessTokens(user);
        }

    }


    public void forgotPassword(String email){
        var userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()) return;
        var user = userOpt.get();

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        userRepository.save(user);

        String resetLink = frontEndUrl + "/users/reset-password?token=" + token;
        String subject = "Відновлення паролю";
        String body = """
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="background: #007bff; color: white; padding: 15px; text-align: center;">
                        <h2>Відновлення паролю</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>Вітаємо, <strong>%s</strong>!</p>
                        <p>Ми отримали запит на відновлення вашого паролю. Натисніть кнопку нижче, щоб задати новий пароль:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" style="background-color: #007bff; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px;">Скинути пароль</a>
                        </div>
                        <p>Або скопіюйте це посилання у браузер:</p>
                        <p><a href="%s">%s</a></p>
                        <p style="color: #888;">Якщо ви не надсилали запит, просто ігноруйте цей лист.</p>
                    </div>
                    <div style="background: #f0f0f0; color: #555; padding: 10px; text-align: center; font-size: 12px;">
                        © %d Your Company. Усі права захищено.
                    </div>
                </div>
            </div>
            """.formatted(user.getUsername(), resetLink, resetLink, resetLink, Calendar.getInstance().get(Calendar.YEAR));

        EmailMessage message = new EmailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setBody(body);

        SmtpService smtpService = new SmtpService();
        smtpService.sendEmail(message);
    }

    public void resetPassword(ResetPasswordDTO dto){
        var token = dto.getToken();
        var user = userRepository.findByResetPasswordToken(token).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Токен не є валідним"));
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}
