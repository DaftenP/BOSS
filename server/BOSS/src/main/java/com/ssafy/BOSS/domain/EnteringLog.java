package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(name = "time", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime time;

    private String deviceFrontImage;

    private String deviceBackImage;

    private int entering;

    private int gateNumber; // 되나..?

    private int stickerCount;

    /**
     * 0이면 정상, 1이면 이슈
     */
    private int issue;

    private int cameraLens;

    public boolean isFail() {
        return issue == 1;
    }

}
