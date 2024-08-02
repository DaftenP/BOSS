package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import com.ssafy.BOSS.dto.memberDto.MemberLogDto;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MemberRepositoryTest {

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    PositionRepository positionRepository;

    @BeforeEach
    void setup() {
        memberRepository.deleteAll();
        departmentRepository.deleteAll();
        positionRepository.deleteAll();
    }

    @Test
    public void memberInsert() throws Exception {
        //given
        Member member = new Member();
        member.setName("ssafy");
        member.setNfc("123");
        member.setIssueCount(1);
        memberRepository.save(member);

        //when
        List<Member> members = memberRepository.findAll();

        //then
        assertNotEquals(0, members.size());
    }

    @Test
    public void testMember() throws Exception {
        //given
        Department department = new Department();
        department.setDepartmentName("test_department");
        departmentRepository.save(department);

        Position position = new Position();
        position.setPositionName("test_position");
        positionRepository.save(position);

        Member member = new Member();
        member.setName("ssafy");
        member.setDepartment(department);
        member.setPosition(position);
        member.setNfc("123");
        member.setIssueCount(1);
        memberRepository.save(member);

        //when
        RequestMemberDto dto = new RequestMemberDto();
        dto.setName("ssafy");
        List<MemberLogDto> logDtos = memberRepository.searchMemberLogs(dto);

        //then
        assertNotEquals(0, logDtos.size());
    }

}