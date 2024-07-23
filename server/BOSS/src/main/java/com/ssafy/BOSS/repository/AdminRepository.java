package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByAdminIdAndAdminPw(String adminId, String adminPw);
}