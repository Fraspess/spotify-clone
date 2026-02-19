package org.example.services.customUserDetails;

import lombok.RequiredArgsConstructor;
import org.example.entities.user.UserEntity;
import org.example.repositories.user.IUserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var userEntity = userRepository.findByUsername(username).orElseThrow(()
                -> new UsernameNotFoundException("User not found"));
        //Інформація про користувача і список його ролей
        var roles = getRoles(userEntity);
        return new User(userEntity.getEmail(), userEntity.getPassword(), roles); // якщо є, то створюється новий юзер на основі того, що в БД
    }// якщо є, то створюється новий юзер на основі того, що в БД

    public UserDetails loadUserById(Long id) {
        var userEntity = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        var roles = getRoles(userEntity);
        return new User(userEntity.getEmail(), userEntity.getPassword(), roles);
    }

    private Collection<? extends GrantedAuthority> getRoles(UserEntity userEntity) {
        return AuthorityUtils.createAuthorityList(
                userEntity.getRoles().stream()
                        .map(role -> "ROLE_" + role.getName())
                        .distinct()
                        .toArray(String[]::new)
        );
    }
}
