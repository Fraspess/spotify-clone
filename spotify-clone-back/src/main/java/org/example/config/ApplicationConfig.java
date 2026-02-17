package org.example.config;

import lombok.RequiredArgsConstructor;
import org.example.entities.RoleEntity;
import org.example.entities.UserEntity;
import org.example.repositories.IUserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final IUserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                var userEntity = userRepository.findByEmail(username).orElseThrow(()
                        -> new UsernameNotFoundException("User not found"));
                //Інформація про користувача і список його ролей
                var roles = getRoles(userEntity);
                return new User(userEntity.getEmail(), userEntity.getPassword(), roles); // якщо є, то створюється новий юзер на основі того, що в БД
            }
            private Collection<? extends GrantedAuthority> getRoles(UserEntity userEntity) {
                return AuthorityUtils.createAuthorityList(
                        userEntity.getRoles().stream()
                                .map(RoleEntity::getName)
                                .distinct()
                                .toArray(String[]::new)
                );
            }
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
