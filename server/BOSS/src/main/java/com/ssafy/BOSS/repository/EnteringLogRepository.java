package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.EnteringLog;
import com.ssafy.BOSS.dto.enteringLog.EnteringLogSpecifiedDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnteringLogRepository extends JpaRepository<EnteringLog, Long> {

    @Query("SELECT log FROM EnteringLog log WHERE log.time = :#{#dto.currentDate}")
    Page<EnteringLog> getEnteringLogs(@Param("dto") EnteringLogSpecifiedDto dto, Pageable pageable);

}
