package org.example.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    @Value("${music.images.dir}")
    private String musicImagesDir;

    @Value("${user.images.dir}")
    private String userImagesDir;

    @Value("${music.dir}")
    private String musicDir;

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final AccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/api/users/**").permitAll()
                        .requestMatchers("/" + musicImagesDir + "/**").permitAll()
                        .requestMatchers("/" + userImagesDir + "/**").permitAll()
                        .requestMatchers("/" + musicDir + "/**").permitAll()
                        .requestMatchers("/static/**").permitAll()
                        .requestMatchers("/swagger-resources/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/api-docs/**").permitAll()
                        .requestMatchers("/rest-api-docs/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/songs/getAll").permitAll()
                        .requestMatchers("/api/test/hello").permitAll()
                        .requestMatchers("/api/users/getById/**").permitAll()
                        .requestMatchers("/api/songs/getById/**").permitAll()
                        .requestMatchers("/api/users/getByUsername/**").permitAll()
                        .requestMatchers("/api/users/getAll").permitAll()
                        .requestMatchers("/api/albums/getById/**").permitAll()
                        .requestMatchers("/api/playlists/getAll").permitAll()
                        .requestMatchers("/api/albums/getAll").permitAll()
                        .requestMatchers("/api/albums/getById/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/songs/create").permitAll()



                        .anyRequest().authenticated()
                )
                .userDetailsService(userDetailsService)
                .authenticationProvider(authenticationProvider)
                .exceptionHandling(e -> e
                        .accessDeniedHandler(accessDeniedHandler)
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"message\": \"Ви не авторизовані\", \"data\": null}");
                        }))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();


    }
}
