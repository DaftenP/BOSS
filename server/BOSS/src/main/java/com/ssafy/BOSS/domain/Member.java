package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter @Setter
public class Member {

    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    private Position position;

    private String name;

    private String deviceType;

    private String nfc;

    private String profileImage;

    private int issueCount;

    private int phoneNumber;

    @OneToMany(mappedBy = "member")
    private List<EnteringLog> logList;
}
