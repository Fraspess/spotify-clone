package org.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer {

    @Value("${music.images.dir}")
    private String musicImagesDir;

    @Value("${user.images.dir}")
    private String userImagesDir;

    @Value("${music.dir}")
    private String musicDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/"+musicDir+"/**")
                .addResourceLocations("file:"+musicDir+"/");
        registry.addResourceHandler("/" + musicImagesDir+"/**")
                .addResourceLocations("file:"+musicImagesDir);
        registry.addResourceHandler("/" + userImagesDir+"/**")
                .addResourceLocations("file:"+userImagesDir);
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173",
                        "")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
