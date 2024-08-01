package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
}
