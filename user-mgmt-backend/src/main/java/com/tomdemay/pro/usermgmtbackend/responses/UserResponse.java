package com.tomdemay.pro.usermgmtbackend.responses;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;

@Data
@Slf4j
public class UserResponse {
    private final int status;
    private final List<String> messages;
    private final long timeStamp;

    public UserResponse(HttpStatus status, List<String> messages) {
        this.status = status.value();
        this.messages = messages;
        this.timeStamp = System.currentTimeMillis();
        log.info("User status: {}", this.toString());
    }

    public UserResponse(HttpStatus status, String message) {
        this(status, Collections.singletonList(message));
    }

}
