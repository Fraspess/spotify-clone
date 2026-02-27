package org.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${music.images.dir}")
    private String musicImagesDir;

    @Value("${user.images.dir}")
    private String userImagesDir;

    @Value("${music.dir}")
    private String musicDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/"+musicDir+"/**")
                .addResourceLocations("file:"+musicDir);
        registry.addResourceHandler("/" + musicImagesDir+"/**")
                .addResourceLocations("file:"+musicImagesDir);
        registry.addResourceHandler("/" + userImagesDir+"/**")
                .addResourceLocations("file:"+ userImagesDir);
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println(frontendUrl);
        registry.addMapping("/**")
                .allowedOrigins(frontendUrl)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }



}
