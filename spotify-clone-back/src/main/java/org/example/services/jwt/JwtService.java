package org.example.services.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.SignatureException;
import lombok.AllArgsConstructor;
import org.example.entities.user.UserEntity;
import org.example.repositories.user.IUserRepository;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import static java.lang.String.format;

@Service
public class JwtService {
    @Value("${access.secret_jwt}")
    private String accessJwtSecret;

    @Value("${refresh.secret_jwt}")
    private String refreshJwtSecret;
    private final String jwtIssuer = "Frasp :)";
    private final IUserRepository userRepository;

    public JwtService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateAccessToken(UserEntity user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("username", user.getUsername())
                .claim("email", user.getEmail())
                .claim("type", "access")
                .setIssuer(jwtIssuer)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
//                .setExpiration(new Date(System.currentTimeMillis() + 60 * 1000))
                .signWith(getAccessKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UserEntity user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("type", "refresh")
                .setIssuer(jwtIssuer)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))
                .signWith(getRefreshKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims extractAccessClaims(String token) {
        try{
        return Jwts.parserBuilder()
                .setSigningKey(getAccessKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        }catch (SignatureException e){
            System.out.println("INVALID SIGNATURE");
        }
        return null;
    }

    private Claims extractRefreshClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getRefreshKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Map<String, String> refreshAccessToken(String refresh) {
        Claims claims = extractRefreshClaims(refresh);

        if (!"refresh".equals(claims.get("type"))) {
            throw new RuntimeException("Invalid token type");
        }
        if (!jwtIssuer.equals(claims.getIssuer())) {
            throw new JwtException("Invalid issuer");
        }
        var userId = claims.getSubject();
        var userOpt = userRepository.findById(Long.valueOf(userId));
        if (userOpt.isEmpty()) throw new RuntimeException("Користувача не знайдено");
        UserEntity user = userOpt.get();
        String newAccess = generateAccessToken(user);
        String newRefresh = generateRefreshToken(user);

        return Map.of("accessToken", newAccess, "refreshToken", newRefresh);
    }

    public Map<String,String> generateRefreshAccessTokens(UserEntity user){
        var access = generateAccessToken(user);
        var refresh = generateRefreshToken(user);
        return Map.of("accessToken", access, "refreshToken", refresh);
    }

    private Key getAccessKey() {
        byte[] keyBytes = Decoders.BASE64.decode(accessJwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Key getRefreshKey() {
        byte[] keyBytes = Decoders.BASE64.decode(refreshJwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    // з токена можна витягнути Id юзера
    public String getUserId(String token) {
        return extractAccessClaims(token).getSubject();
    }

    // з токена можна витягнути username юзера
    public String getUsername(String token) {
        return extractAccessClaims(token).get("username", String.class);
    }

    // метод повертає дату до якої живе токен
    public Date getExpirationDate(String token) {
        return extractAccessClaims(token).getExpiration();
    }

    public boolean validateAccessToken(String token) {

        try {
            extractAccessClaims(token);
            return true;
        } catch (JwtException ex) {
            System.out.println("Jwt exception");
            return false;
        }
    }


    public boolean validateRefreshToken(String token) {
        try {
            extractRefreshClaims(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }
}
