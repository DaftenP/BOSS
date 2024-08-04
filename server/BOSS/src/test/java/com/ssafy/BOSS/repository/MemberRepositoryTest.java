package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.MemberLogDto;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import com.ssafy.BOSS.fixture.MemberFixtureService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
class MemberRepositoryTest {

    @Autowired
    MemberFixtureService memberFixtureService;

    @Autowired
    MemberRepository memberRepository;

    @AfterEach
    void setup() {
        memberFixtureService.deleteAll();
    }

    @Test
    public void memberInsert() throws Exception {
        //given
        Member member = memberFixtureService.getMember();

        //when
        List<Member> members = memberRepository.findAll();

        //then
        assertNotEquals(0, members.size());
    }

    @Test
    public void testMember() throws Exception {
        //given
        Member member = memberFixtureService.getMember();

        //when
        RequestMemberDto dto = new RequestMemberDto();
        dto.setName("ssafy");
        List<MemberLogDto> logDtos = memberRepository.searchMemberLogs(dto);

        //then
        assertNotEquals(0, logDtos.size());
    }

}