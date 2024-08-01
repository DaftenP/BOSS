package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@Getter @Setter
@ToString
@Entity
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    private String name;

    private String nfc;

    private String profileImage;

    @ColumnDefault("0")
    private int issueCount;

    private String phoneNumber;

    @OneToMany(mappedBy = "member")
    private List<EnteringLog> logList;
}
