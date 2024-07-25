package com.ssafy.BOSS.service;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member join(Member member) {
        validateDuplicateMember(member); // 중복 검사
        return memberRepository.save(member);
    }

    private void validateDuplicateMember(Member member) {
        Optional<Member> joinMember = memberRepository.findByNfc(member.getNfc());
        if(!joinMember.isEmpty()) {
            throw new IllegalStateException("이미 존재하는 회원입니다.");
        }
    }
}