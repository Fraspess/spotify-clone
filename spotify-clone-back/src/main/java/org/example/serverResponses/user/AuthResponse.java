package org.example.serverResponses.user;

import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class AuthResponse {
    public String message;
    public Map<String,String> token;
}
