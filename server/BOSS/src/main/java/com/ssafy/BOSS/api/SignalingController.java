package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.SignalMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class SignalingController {
    private final SimpMessagingTemplate messagingTemplate;

    public SignalingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/offer")
    @SendTo("/api/topic/offer")
    public SignalMessage offer(SignalMessage message) {
        return message;
    }

    @MessageMapping("/answer")
    @SendTo("/api/topic/answer")
    public SignalMessage answer(SignalMessage message) {
        return message;
    }

    @MessageMapping("/candidate")
    @SendTo("/api/topic/candidate")
    public SignalMessage candidate(SignalMessage message) {
        return message;
    }
}
