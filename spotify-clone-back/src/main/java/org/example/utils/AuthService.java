package org.example.utils;

import lombok.RequiredArgsConstructor;
import org.example.entities.user.UserEntity;
import org.example.repositories.user.IUserRepository;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final IUserRepository userRepository;

    public UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientAuthenticationException("Користувач не авторизований");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Користувач не знайдений"));
    }
}
