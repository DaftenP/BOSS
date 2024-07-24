package com.ssafy.BOSS.domain;

import com.ssafy.BOSS.repository.AdminRepository;
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

    private String adminLoginId;

    @OneToMany(mappedBy = "admin")
    private List<LoginLog> loginLogs;

    private String adminLoginPw;

    private String adminName;
}
