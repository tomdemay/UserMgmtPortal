package com.tomdemay.pro.usermgmtbackend.exceptions;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.opencsv.exceptions.CsvMalformedLineException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;

import java.sql.SQLIntegrityConstraintViolationException;

@RestControllerAdvice
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler
    public ResponseEntity<UserResponseException> handleException(MaxUploadSizeExceededException ex) {
        log.error("Exception caught", ex);
        final ResponseEntity<UserResponseException> re = UserResponseException.ResponseEntity(HttpStatus.PAYLOAD_TOO_LARGE, "File size is too large. File size is limited to 5MB");
        log.warn("User Response {}", re.toString());
        return re;
    }

    @ExceptionHandler
    public ResponseEntity<UserResponseException> handleException(ResourceNotFoundException ex) {
        log.error("Exception caught", ex);
        final ResponseEntity<UserResponseException> re = UserResponseException.ResponseEntity(HttpStatus.NOT_FOUND, "User not found");
        log.warn("User Response {}", re.toString());
        return re;
    }

    @ExceptionHandler
    public ResponseEntity<UserResponseException> handleException(ConstraintViolationException ex) {
        final List<String> messages = ex
            .getConstraintViolations()
                .stream()
                .map(violation -> String.format("%s (%s)", violation.getMessage(), violation.getInvalidValue()))
                .collect(Collectors.toList());
        final ResponseEntity<UserResponseException> re = UserResponseException.ResponseEntity(HttpStatus.CONFLICT, messages);
        log.warn("User Response {}", re.toString());
        return re;
    }
    
    @ExceptionHandler
    public ResponseEntity<UserResponseException> handleException(DataIntegrityViolationException ex) {
        Throwable exception = (Exception) ex;
        if (exception.getCause() instanceof org.hibernate.exception.ConstraintViolationException) {
            exception = ex.getCause();
        }
        if (exception.getCause() instanceof SQLIntegrityConstraintViolationException) {
            exception = exception.getCause();
        }
        final String message = exception.getMessage().split(" for key")[0];
        log.error("Data integrity violation occurred: {}", message);
        final ResponseEntity<UserResponseException> re = UserResponseException.ResponseEntity(HttpStatus.CONFLICT,
                message);
        log.warn("User Response {}", re.toString());
        return re;
    }

    @ExceptionHandler
    public ResponseEntity<UserResponseException> handleException(CsvRequiredFieldEmptyException ex) {
        log.error("Exception caught", ex);
        final ResponseEntity<UserResponseException> re = UserResponseException.ResponseEntity(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Invalid file format.");
        log.warn("User Response {}", re.toString());
        return re;
    }

    @ExceptionHandler
    public ResponseEntity<UserResponseException> handleException(CsvMalformedLineException ex) {
        log.error("Exception caught", ex);
        final ResponseEntity<UserResponseException> re = UserResponseException.ResponseEntity(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Invalid file format.");
        log.warn("User Response {}", re.toString());
        return re;
    }

    @ExceptionHandler
    public ResponseEntity<UserResponseException> handleException(Exception ex) {
        Throwable cause = ex.getCause();
        if (cause != null && cause instanceof CsvMalformedLineException) {
            return handleException((CsvMalformedLineException)cause);            
        }
        log.error("Exception caught", ex);

        final ResponseEntity<UserResponseException> re = UserResponseException.ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        log.warn("User Response {}", re.toString());
        return re;
    }
}
