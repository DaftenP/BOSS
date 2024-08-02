package com.ssafy.BOSS.api;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.repository.EnteringLogRepository;
import com.ssafy.BOSS.repository.MemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
class EnteringLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    EnteringLogRepository enteringLogRepository;

    @Autowired
    MemberRepository memberRepository;

    @AfterEach
    void setup() {
        enteringLogRepository.deleteAll();
        memberRepository.deleteAll();
    }

    @DisplayName("/api/log/view 테스트")
    @Test
    void viewLog() throws Exception {

        Member member = new Member();
        member.setName("ssafy");
        memberRepository.save(member);

        EnteringLog enteringLog = new EnteringLog();
        enteringLog.setMember(member);
        enteringLog.setTime(LocalDateTime.now());
        enteringLog.setDeviceBackImage("back.png");
        enteringLog.setDeviceFrontImage("front.png");
        enteringLog.setEntering(0);
        enteringLog.setGateNumber(0);
        enteringLog.setStickerCount(0);
        enteringLog.setIssue(0);
        enteringLog.setCameraLens(0);
        enteringLogRepository.save(enteringLog);

        MvcResult mvcResult = mockMvc
                .perform(MockMvcRequestBuilders.get("/api/log/view"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String json = mvcResult.getResponse().getContentAsString();


        System.out.println("=============================");
        System.out.println("json = " + json);
        System.out.println("=============================");

    }


}