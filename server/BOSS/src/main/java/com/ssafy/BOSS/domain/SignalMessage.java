package com.ssafy.BOSS.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class SignalMessage {
    private String type;
    private String sdp;
    private String candidate;
}
