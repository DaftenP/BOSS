package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.RequestMemberDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByNfc(String nfc);

    boolean existsByNfc(String nfc);

    @Query("SELECT m " +
            " FROM Member m " +
            "WHERE (:#{#memberDto.name} IS NULL OR m.name LIKE %:#{#memberDto.name}%) " +
            "AND (:#{#memberDto.departmentName} IS NULL OR m.department.departmentName LIKE %:#{#memberDto.departmentName}%)" +
            "AND (:#{#memberDto.positionName} IS NULL OR m.position.positionName LIKE %:#{#memberDto.positionName}%)" +
            "AND (:#{#memberDto.nfc} IS NULL OR m.nfc LIKE %:#{#memberDto.nfc}%)" +
            "AND (:#{#memberDto.issue} < 0 OR m.issueCount = :#{#memberDto.issue})")
    List<Member> searchMember(@Param("memberDto") RequestMemberDto memberDto);

    boolean existsByMemberLoginIdAndMemberLoginPw(String loginId, String loginPw);
}
