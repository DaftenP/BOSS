package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@Table(indexes = {@Index(name = "time_index", columnList = "time")})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EnteringLog {

    @Id @GeneratedValue
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mameber_id")
    private Member member;

    private String time;

    private String deviceFrontImage;

    private String deviceBackImage;

    private int entering;

    private int gateNumber; // 되나..?

    private int stickerCount;

    private int issue;

    private int cameraLens;

}
