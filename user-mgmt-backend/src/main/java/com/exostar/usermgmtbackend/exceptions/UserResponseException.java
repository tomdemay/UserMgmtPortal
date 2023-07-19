package com.exostar.usermgmtbackend.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.AccessLevel;

import java.util.List;
import java.util.Collections;
import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class UserResponseException {
    private int status;
    private List<String> messages;
    private Throwable exception;
    private Date timeStamp;

    public static ResponseEntity<UserResponseException> ResponseEntity(HttpStatus status, List<String> messages, Throwable exception) {
        UserResponseException ure = new UserResponseException(status.value(), messages, exception, new Date());
        return new ResponseEntity<UserResponseException>(ure, status);
    }

    public static ResponseEntity<UserResponseException> ResponseEntity(HttpStatus status, String message, Throwable exception) {
        return ResponseEntity(status, Collections.singletonList(message), exception);
    }
    public static ResponseEntity<UserResponseException> ResponseEntity(HttpStatus status, List<String> messages) {
        return ResponseEntity(status, messages, null);
    }

    public static ResponseEntity<UserResponseException> ResponseEntity(HttpStatus status, String message) {
        return ResponseEntity(status, Collections.singletonList(message));
    }
}
