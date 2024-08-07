package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Entity
public class Position {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "position_id")
    private int positionId;

    @Column(unique = true)
    private String positionName;
}
