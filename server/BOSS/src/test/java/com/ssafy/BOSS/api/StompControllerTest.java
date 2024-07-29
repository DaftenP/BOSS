package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.shadow.com.univocity.parsers.annotations.Validate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class StompControllerTest {

    @LocalServerPort
    private int port;

    private WebSocketStompClient stompClient;

    private final WebSocketHttpHeaders headers = new WebSocketHttpHeaders();

    @BeforeEach
    public void setup() {
        List<Transport> transports = new ArrayList<>(1);
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        this.stompClient = new WebSocketStompClient(new SockJsClient(transports));
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    @Test
    public void testLogFailEndpoint() throws Exception {
        String url = "ws://localhost:" + port + "/api/websocket";
        StompSession session = stompClient.connect(url, headers, new StompSessionHandlerAdapter() {}).get(1, TimeUnit.SECONDS);

        BlockingQueue<EnteringLog> blockingQueue = new ArrayBlockingQueue<>(1);

        session.subscribe("/api/topic/log-fail", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return EnteringLog.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.offer((EnteringLog) payload);
            }
        });

        EnteringLog logMessage = EnteringLog.builder().time("테스트!").build();
        // logMessage 필드 설정

        session.send("/app/log-fail", logMessage);

        EnteringLog receivedMessage = blockingQueue.poll(5, TimeUnit.SECONDS);
        assertEquals(logMessage.getTime(), "테스트!");

    }

}