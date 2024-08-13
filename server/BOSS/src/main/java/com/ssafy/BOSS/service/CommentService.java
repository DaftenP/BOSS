package com.ssafy.BOSS.service;

import com.ssafy.BOSS.dto.sseDto.SseEmitters;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
public class CommentService {

    private final SseEmitters sseEmitters;

    public SseEmitter getSseEmitters() {

        SseEmitter emitter = new SseEmitter(300_000L);

        sseEmitters.add(emitter);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return emitter;
    }

    public void createIssue() {
        log.info("createIssue callback");
        sseEmitters.send("ok");
    }

}
