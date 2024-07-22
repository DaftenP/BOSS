package com.ssafy.BOSS.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Position {

    @Id @GeneratedValue
    @Column(name = "position_id")
    private int positionId;

    private String positionName;
}
