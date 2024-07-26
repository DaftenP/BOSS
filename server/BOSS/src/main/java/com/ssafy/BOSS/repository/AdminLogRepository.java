package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminLogRepository extends JpaRepository<LoginLog, Long> {
}
