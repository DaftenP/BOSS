package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "administrator")
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
