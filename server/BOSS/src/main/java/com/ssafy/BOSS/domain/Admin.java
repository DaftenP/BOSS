package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "administrator")
@Getter @Setter
public class Admin {

    @Id @GeneratedValue
    @Column(name = "admin_id")
    private Long id;

    private String adminID;

    @OneToMany(mappedBy = "admin")
    private List<LoginLog> loginLogs;

    private String adminPw;

    private String adminName;
}
