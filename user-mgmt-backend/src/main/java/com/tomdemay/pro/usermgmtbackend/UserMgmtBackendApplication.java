package com.tomdemay.pro.usermgmtbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Slf4j
public class UserMgmtBackendApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        try {
            log.trace("Entering main function...");
            SpringApplication.run(UserMgmtBackendApplication.class, args);
        } catch (Throwable e) {
            log.error("Exception thrown: ", e);
        } finally {
            log.trace("Exiting main function...");
        }
    }
}
