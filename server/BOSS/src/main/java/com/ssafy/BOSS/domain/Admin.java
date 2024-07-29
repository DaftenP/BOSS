package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "administrator")
@Getter @Setter
public class Admin {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long id;

    private String adminLoginId;

    @OneToMany(mappedBy = "admin")
    private List<LoginLog> loginLogs;

    private String adminLoginPw;

    private String adminName;
}
