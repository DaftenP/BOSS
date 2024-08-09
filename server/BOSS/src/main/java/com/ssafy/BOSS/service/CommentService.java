package com.ssafy.BOSS.service;

import com.ssafy.BOSS.dto.sseDto.SseEmitters;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

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


}
