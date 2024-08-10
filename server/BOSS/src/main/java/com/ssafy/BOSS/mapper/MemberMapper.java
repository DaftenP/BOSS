package com.ssafy.BOSS.mapper;

import com.ssafy.BOSS.domain.Member;
import com.ssafy.BOSS.dto.memberDto.MemberDto;
import com.ssafy.BOSS.dto.memberDto.MemberLoginDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    MemberDto memberToMemberDto(Member member);

    MemberLoginDto memberToMemberLoginDto(Member member);
}
