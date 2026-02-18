package org.example.services.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.SignatureException;
import org.example.entities.user.UserEntity;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

import static java.lang.String.format;
@Service
public class JwtService {
    @Value("${my.secret_jwt}")
    private String jwtSecret;
    private final String jwtIssuer = "Frasp";

    public String generateAccessToken(UserEntity user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("name", user.getUsername())
                .claim("email", user.getEmail())
                .setIssuer(jwtIssuer)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    // з токена можна витягнути Id юзера
    public String getUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)    // перевіряється чи цей токен видавався нашим серваком
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject(); //з токена бере перший елемент Id
    }

    // з токена можна витягнути username юзера
    public String getUsername(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("email", String.class);
        }
        catch(Exception ex) {
            return null;
        }
    }

    // метод повертає дату до якої живе токен
    public Date getExpirationDate(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getExpiration();
    }

    //перевфряє чи наш токен валідний і чи видавався нашим сервером
    public boolean validate(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (SignatureException ex) {
            System.out.println("Invalid JWT signature - "+ ex.getMessage());
        } catch (MalformedJwtException ex) {
            System.out.println("Invalid JWT token - " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            System.out.println("Expired JWT token - " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.out.println("Unsupported JWT token - " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.out.println("JWT claims string is empty - " + ex.getMessage());
        }
        return false;
    }
    }
