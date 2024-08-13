package com.ssafy.BOSS.dto.sseDto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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
        emitter.onTimeout(() -> {
            log.info("onTimeout callback");
        });
        emitter.onError((e) -> {
            log.info("onError callback");
            log.error(e.getMessage());
        });

        return emitter;
    }

    public void createIssue() {
        log.info("createIssue callback");

        List<SseEmitter> removedEmitters = new ArrayList<>();

        emitters.forEach(emitter -> {
            log.info("emitter createIssue callback");
            log.info(emitter.toString());
            try {
                emitter.send("ok");
                log.info("전송 성공!");
            } catch (IOException e) {
                removedEmitters.add(emitter);
                System.out.println("로그 전송에 실패했습니다.");
            }
        });

        for(SseEmitter emitter : removedEmitters) {
            emitter.complete();
        }

    }
}
