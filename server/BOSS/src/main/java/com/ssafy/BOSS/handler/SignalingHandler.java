package com.ssafy.BOSS.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebRTC 시그널링을 처리하는 WebSocket 핸들러 클래스입니다.
 * 클라이언트 간 시그널링 메시지를 중계합니다.
 */
public class SignalingHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(SignalingHandler.class);

    /** 연결된 모든 WebSocket 세션을 저장하는 맵 */
    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    /**
     * 클라이언트가 연결되었을 때 호출되는 메서드입니다.
     * @param session 연결된 WebSocket 세션
     * @throws Exception 연결 중 발생할 수 있는 예외
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String sessionId = session.getId();
        sessions.put(sessionId, session);
        logger.info("New WebSocket connection established: " + sessionId);
    }

    /**
     * 클라이언트로부터 메시지를 받았을 때 호출되는 메서드입니다.
     * @param session 메시지를 보낸 WebSocket 세션
     * @param message 받은 텍스트 메시지
     * @throws Exception 메시지 처리 중 발생할 수 있는 예외
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.debug("Received message: " + payload);

        // 받은 메시지를 모든 연결된 클라이언트에게 브로드캐스트
        for (WebSocketSession s : sessions.values()) {
            if (s.isOpen() && !s.getId().equals(session.getId())) {
                try {
                    s.sendMessage(new TextMessage(payload));
                } catch (IOException e) {
                    logger.error("Error sending message to session " + s.getId(), e);
                }
            }
        }
    }

    /**
     * 클라이언트 연결이 종료되었을 때 호출되는 메서드입니다.
     * @param session 종료된 WebSocket 세션
     * @param status 연결 종료 상태
     * @throws Exception 연결 종료 처리 중 발생할 수 있는 예외
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = session.getId();
        sessions.remove(sessionId);
        logger.info("WebSocket connection closed: " + sessionId + " with status " + status);
    }

    /**
     * WebSocket 통신 중 예외가 발생했을 때 호출되는 메서드입니다.
     * @param session 예외가 발생한 WebSocket 세션
     * @param exception 발생한 예외
     * @throws Exception 예외 처리 중 발생할 수 있는 추가 예외
     */
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        logger.error("WebSocket transport error: " + session.getId(), exception);
        session.close(CloseStatus.SERVER_ERROR);
    }
}
