package com.ssafy.BOSS.config;

import com.ssafy.BOSS.handler.SignalingHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket 설정을 위한 구성 클래스입니다.
 * WebRTC 시그널링을 위한 WebSocket 핸들러를 등록합니다.
 */
@EnableWebSocket
@Configuration
public class WebRTCConfig implements WebSocketConfigurer {

    /**
     * WebSocket 핸들러를 등록하는 메서드입니다.
     *
     * @param registry WebSocket 핸들러 레지스트리
     */
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new SignalingHandler(), "/signal")
                .setAllowedOrigins("*"); // CORS 설정, 실제 배포 시 보안을 위해 특정 도메인으로 제한해야 함
    }
}
