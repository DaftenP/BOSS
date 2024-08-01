package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByNfc(String nfc);

    @Query("SELECT new com.ssafy.BOSS.dto.memberDto.MemberLogDto(m.name, m.department.departmentName, m.position.positionName, m.nfc, m.issueCount)" +
            "FROM Member m" +)
}
