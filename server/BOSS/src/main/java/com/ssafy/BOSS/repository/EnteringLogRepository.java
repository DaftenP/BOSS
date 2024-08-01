package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogDto;
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

    List<EnteringLog> findEnteringLogsByMember(Optional<Member> member);

    @Query("SELECT new com.ssafy.BOSS.dto.enteringLog.EnteringLogDto(m.name, p.positionName, d.departmentName, e.logId, e.entering, e.issue, e.time)" +
            "FROM Member m " +
            "JOIN m.logList e " +
            "JOIN m.position p " +
            "JOIN m.department d " +
            "WHERE (:name IS NULL OR m.name LIKE %:#{#logDto.name}%) " +
            "AND (:positionId IS NULL OR p.positionId = :#{#logDto.positionName}) " +
            "AND (:departmentId IS NULL OR d.departmentId = :#{#logDto.departmentName}) " +
            "AND (:entering IS NULL OR e.entering = :#{#logDto.entering}) " +
            "AND (:issue IS NULL OR e.issue = :#{#logDto.issue}) " +
            "AND (:time IS NULL OR e.time = :#{#logDto.time})")
    List<EnteringLogDto> searchEnteringLogs(@Param("logDto")RequestEnteringLogDto logDto);
}
