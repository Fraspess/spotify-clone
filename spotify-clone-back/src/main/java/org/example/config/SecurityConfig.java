package org.example.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.services.user.UserService;
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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    @Value("${music.images.dir}")
    private String musicImagesDir;

    @Value("${user.images.dir}")
    private String userImagesDir;

    @Value("${music.dir}")
    private String musicDir;

    @Value("${frontend.url}")
    private String frontEndUrl;

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final AccessDeniedHandler accessDeniedHandler;
    private final UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                            String email = oAuth2User.getAttribute("email");
                            String image = oAuth2User.getAttribute("picture");
                            Map<String, String> tokens = userService.googleAuth(email, image);

                            String accessToken = tokens.get("accessToken");
                            String refreshToken = tokens.get("refreshToken");

                            response.sendRedirect(frontEndUrl + "/oauth2/callback?accessToken=" + accessToken + "&refreshToken=" + refreshToken);
                        }))

                        .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/").permitAll()
                                .requestMatchers("/api/users/**").permitAll()
                                .requestMatchers("/api/users/register-request").permitAll()
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
                                .requestMatchers("/api/users/reset-password").permitAll()
                                .requestMatchers("/api/users/forgot-password").permitAll()
                                .requestMatchers("/api/songs/search/**").permitAll()
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
