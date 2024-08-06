package com.ssafy.BOSS.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(indexes = {@Index(name = "time_index", columnList = "time")})
public class EnteringLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Member member;

    @Column(name = "time", nullable = false)
    @CreationTimestamp
    private LocalDateTime time;

    private String deviceFrontImage;

    private String deviceBackImage;

    private int entering;

    private int gateNumber;

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
