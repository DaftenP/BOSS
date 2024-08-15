package com.ssafy.BOSS.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.BOSS.fixture.MemberFixtureService;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@SpringBootTest
class MemberControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    MemberFixtureService memberFixtureService;

    @BeforeEach
    public void setUp() {
        memberFixtureService.deleteAll();
    }

//    @Test
//    public void testMemberRegisteSuccess() throws Exception {
//        // Given
//        Member member = memberFixtureService.getMember();
//        MemberRegistDto memberRegistDto = new MemberRegistDto();
//        memberRegistDto.setDepartmentId(member.getDepartment().getDepartmentId());
//        memberRegistDto.setPositionId(member.getPosition().getPositionId());
//        memberRegistDto.setNfc("testNFC");
//        memberRegistDto.setName("test!");
//
//        // When & Then
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/member/regist")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(memberRegistDto)))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("test!")); // 필드 검증
//    }

//    @Test
//    public void testMemberRegisteNoContent() throws Exception {
//        // Given
//        MemberRegistDto memberRegistDto = new MemberRegistDto(/* 초기화 */);
//
//        // When & Then
//        mockMvc.perform(post("/api/member/regist")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(memberRegistDto)))
//                .andExpect(status().isNoContent());
//    }
//
//    @Test
//    public void testMemberRegisteException() throws Exception {
//        // Given
//        MemberRegistDto memberRegistDto = new MemberRegistDto(/* 초기화 */);
//
//        // 특정 조건을 통해 예외를 발생시키는 경우에 대한 처리
//        // 예: 잘못된 데이터로 인해 예외가 발생하도록 설정
//
//        // When & Then
//        mockMvc.perform(post("/api/member/regist")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(memberRegistDto)))
//                .andExpect(status().isInternalServerError());
//    }

}