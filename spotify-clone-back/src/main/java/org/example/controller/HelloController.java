package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hello")
@Tag(name = "Hello", description = "Test endpoints")
public class HelloController {

    @GetMapping
    @Operation(summary = "Test endpoint", description = "Простий endpoint для перевірки роботи бекенду та Swagger")
    public String hello() {
        return "Spotify backend is running";
    }
}


