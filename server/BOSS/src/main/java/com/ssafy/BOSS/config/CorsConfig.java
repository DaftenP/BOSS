package com.ssafy.BOSS.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

@EnableWebSecurity
@Configuration
public class CorsConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
<<<<<<< Updated upstream
        http.cors(AbstractHttpConfigurer::disable);
=======
        http.cors(AbstractHttpConfigurer::disable).csrf(AbstractHttpConfigurer::disable);
>>>>>>> Stashed changes
        return http.build();
    }

}
