package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(indexes = {@Index(name = "time_index", columnList = "time")})
public class EnteringLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
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
