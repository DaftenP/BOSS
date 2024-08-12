package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Admin;
import com.ssafy.BOSS.domain.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminLogRepository extends JpaRepository<LoginLog, Long> {
    List<LoginLog> findByAdmin(Admin admin);
}
