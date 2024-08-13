package com.ssafy.BOSS.dto.sseDto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@Slf4j
public class SseEmitters {

    private final Set<SseEmitter> emitters = new CopyOnWriteArraySet<>();

    public SseEmitter add(SseEmitter emitter) {
        this.emitters.add(emitter);
        log.info("new emitter added: {}", emitter);
        log.info("emitter list size: {}", emitters.size());
        emitter.onCompletion(() -> {
            log.info("onCompletion callback");
            emitters.remove(emitter);
        });
        emitter.onError((e) -> {
            log.info("onError callback");
            log.error(e.getMessage(), e);
            emitter.completeWithError(e);
        });
        emitter.onTimeout(() -> {
            log.info("onTimeout callback");
            emitter.complete();
        });
        return emitter;
    }

    public void send(String ok) {
        for(SseEmitter emitter : emitters) {
            send(emitter, ok);
        }
    }

    private void send(SseEmitter emitter, String message) {
        try {
            emitter.send(message);
        } catch (IOException | IllegalStateException e) {
            emitter.completeWithError(e);
        }
    }
}
