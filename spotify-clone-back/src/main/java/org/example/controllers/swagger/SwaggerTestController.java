package org.example.controllers.swagger;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Swagger Test Controller", description = "Контролер для тестування Swagger")
public class SwaggerTestController {

    @GetMapping("/hello")
    @Operation(summary = "Простий GET запит", description = "Повертає тестове повідомлення")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успішна відповідь")
    })
    public String hello() {
        return "Swagger працює!";
    }

    @PostMapping("/echo")
    @Operation(summary = "POST запит", description = "Повертає переданий текст")
    public String echo(@RequestBody String message) {
        return "Ти надіслав: " + message;
    }
}