package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Department;
import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.domain.Position;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import net.bytebuddy.asm.Advice;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class EnteringLogRepositoryTest {

    @Autowired
    EnteringLogRepository enteringLogRepository;

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    PositionRepository positionRepository;

    @AfterEach
    void setup() {
        enteringLogRepository.deleteAll();
        memberRepository.deleteAll();
        departmentRepository.deleteAll();
        positionRepository.deleteAll();
    }

    @DisplayName("기본 저장 및 쿼리 테스트")
    @Test
    public void basicSaveAndFindTest() {
        //given
        Member member = new Member();
        member.setName("ssafy");
//        member.setNfc("123");
//        member.setProfileImage("ssafy.png");
//        member.setPhoneNumber("01012345678");
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

        //when
        List<EnteringLog> logs = enteringLogRepository.findAll();

        //then
        assertNotEquals(0, logs.size());
    }

    @DisplayName("searchEnteringLog 기본 쿼리 테스트")
    @Test
    void basicQueryTest() {
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

        //when
        List<EnteringLog> logs = enteringLogRepository.findAll();

        //then
        assertNotEquals(0, logs.size());

        //when
        RequestEnteringLogDto dto = new RequestEnteringLogDto();
        dto.setName("ssafy");
        List<EnteringLogDto> enteringLogDtos = enteringLogRepository.searchEnteringLogs(dto);

        //then
        assertNotEquals(0, enteringLogDtos.size());
    }

    @DisplayName("멤버가 없는 로그 전체 조회 테스트")
    @Test
    void queryMemberNullLogTest() {
        EnteringLog enteringLog = new EnteringLog();
        enteringLog.setTime(LocalDateTime.now());
        enteringLog.setDeviceBackImage("back.png");
        enteringLog.setDeviceFrontImage("front.png");
        enteringLog.setEntering(0);
        enteringLog.setGateNumber(0);
        enteringLog.setStickerCount(0);
        enteringLog.setIssue(0);
        enteringLog.setCameraLens(0);
        enteringLogRepository.save(enteringLog);

        List<EnteringLog> logs = enteringLogRepository.findAll();
        assertNotEquals(0, logs.size());
    }

    @DisplayName("부서와 직책이 없는 멤버를 가리키는 로그 조회 테스트")
    @Test
    void queryDepartmentNullPositionNullLogTest() {
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

        List<EnteringLog> logs = enteringLogRepository.findAll();
        assertNotEquals(0, logs.size());
    }

}