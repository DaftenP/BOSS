package com.ssafy.BOSS.domain;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignalMessage {
    private String type;
    private String sdp;
    private String candidate;
}
