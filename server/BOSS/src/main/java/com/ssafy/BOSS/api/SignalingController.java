package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.SignalMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class SignalingController {
    private final SimpMessagingTemplate messagingTemplate;

    public SignalingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/offer")
    @SendTo("/api/topic/offer")
    public SignalMessage offer(SignalMessage message) {
        log.info("SignalingController::offer");
        log.info("message: {}", message);
        return message;
    }

    @MessageMapping("/answer")
    @SendTo("/api/topic/answer")
    public SignalMessage answer(SignalMessage message) {
        log.info("SignalingController::answer");
        log.info("message: {}", message);
        return message;
    }

    @MessageMapping("/candidate")
    @SendTo("/api/topic/candidate")
    public SignalMessage candidate(SignalMessage message) {
        log.info("SignalingController::candidate");
        log.info("message: {}", message);
        return message;
    }
}
