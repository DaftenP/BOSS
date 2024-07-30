package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class StompController {

    @MessageMapping("/log-fail")
    @SendTo("/api/topic/log-fail")
    EnteringLog enteringLog(EnteringLog enteringLog) {
        return enteringLog;
    }

}
