package com.heavenhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // For now, allow all API calls so we can easily test our application with the frontend!
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    // Allowed domains including Vercel and local Vite
                    corsConfig.setAllowedOriginPatterns(java.util.List.of(
                            "https://heaven-kticpo4cw-ansh-khare89s-projects.vercel.app",
                            "http://localhost:5173",
                            "*"));
                    corsConfig.setAllowedMethods(java.util.List.of("*"));
                    corsConfig.setAllowedHeaders(java.util.List.of("*"));
                    return corsConfig;
                }))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}
