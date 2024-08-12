package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import com.ssafy.BOSS.dto.enteringLog.RequestEnteringLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EnteringLogRepository extends JpaRepository<EnteringLog, Long> {

    @Query("SELECT log FROM EnteringLog log WHERE log.time = :#{#dto.currentDate}")
    Page<EnteringLog> getEnteringLogs(@Param("dto") EnteringLogSpecifiedDto dto, Pageable pageable);

    List<EnteringLog> findEnteringLogsByMember(Member member);

    @Query("SELECT e " +
            "FROM EnteringLog e " +
            "WHERE " +
            "(:#{#logDto.name} IS NULL OR e.member.name LIKE %:#{#logDto.name}%) " +
            "AND (:#{#logDto.memberId} < 0 OR e.member.memberId = :#{#logDto.memberId}) " +
            "AND (:#{#logDto.positionName} IS NULL OR e.member.position.positionName LIKE %:#{#logDto.positionName}%) " +
            "AND (:#{#logDto.positionId} < 0 OR e.member.position.positionId = :#{#logDto.positionId}) " +
            "AND (:#{#logDto.departmentName} IS NULL OR e.member.department.departmentName LIKE %:#{#logDto.departmentName}%) " +
            "AND (:#{#logDto.departmentId} < 0 OR e.member.department.departmentId = :#{#logDto.departmentId}) " +
            "AND (:#{#logDto.entering} < 0 OR e.entering = :#{#logDto.entering}) " +
            "AND (:#{#logDto.issue} < 0 OR e.issue = :#{#logDto.issue}) " +
            "AND (:#{#logDto.startTime} <= e.time AND e.time <= :#{#logDto.endTime})")
    List<EnteringLog> searchEnteringLogs(@Param("logDto") RequestEnteringLogDto logDto);
}
