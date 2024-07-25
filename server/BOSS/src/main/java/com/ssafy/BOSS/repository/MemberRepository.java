package com.ssafy.BOSS.repository;

import com.ssafy.BOSS.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByNfc(String nfc);
}
