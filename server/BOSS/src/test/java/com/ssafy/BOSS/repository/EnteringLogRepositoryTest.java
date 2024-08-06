package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import com.ssafy.BOSS.fixture.MemberFixtureService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
class EnteringLogRepositoryTest {

    @Autowired
    EnteringLogRepository enteringLogRepository;

    @Autowired
    MemberFixtureService memberFixtureService;

    @AfterEach
    void setup() {
        enteringLogRepository.deleteAll();
        memberFixtureService.deleteAll();
    }

    @DisplayName("기본 저장 및 쿼리 테스트")
    @Test
    public void basicSaveAndFindTest() {
        //given
        Member member = memberFixtureService.getMember();

        EnteringLog enteringLog = new EnteringLog();
        enteringLog.setMember(member);
        enteringLog.setTime(Instant.now());
        enteringLog.setDeviceBackImage("back.png");
        enteringLog.setDeviceFrontImage("front.png");
        enteringLog.setEntering(0);
        enteringLog.setGateNumber(0);
        enteringLog.setStickerCount(0);
        enteringLog.setIssue(0);
        enteringLog.setCameraLens(0);
        enteringLogRepository.save(enteringLog);

        //when
        List<EnteringLog> logs = enteringLogRepository.findAll();

        //then
        assertNotEquals(0, logs.size());
    }

    @DisplayName("searchEnteringLog 기본 쿼리 테스트")
    @Test
    void basicQueryTest() {
        //given
        Member member = memberFixtureService.getMember();

        EnteringLog enteringLog = new EnteringLog();
        enteringLog.setMember(member);
        enteringLog.setTime(Instant.now());
        enteringLog.setDeviceBackImage("back.png");
        enteringLog.setDeviceFrontImage("front.png");
        enteringLog.setEntering(0);
        enteringLog.setGateNumber(0);
        enteringLog.setStickerCount(0);
        enteringLog.setIssue(0);
        enteringLog.setCameraLens(0);
        enteringLogRepository.save(enteringLog);

        //when
        List<EnteringLog> logs = enteringLogRepository.findAll();

        //then
        assertNotEquals(0, logs.size());

        //when
        RequestEnteringLogDto dto = new RequestEnteringLogDto();
//        dto.setName("ssafy");
        List<EnteringLog> enteringLogs = enteringLogRepository.searchEnteringLogs(dto);

        //then
        assertNotEquals(0, enteringLogs.size());
    }

}