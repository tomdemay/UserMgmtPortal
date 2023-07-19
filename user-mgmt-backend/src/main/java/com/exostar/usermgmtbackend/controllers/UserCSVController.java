package com.exostar.usermgmtbackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.opencsv.bean.ColumnPositionMappingStrategy;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.opencsv.bean.MappingStrategy;

import lombok.extern.slf4j.Slf4j;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Collections;
import java.util.List;
import java.io.IOException;

import com.exostar.usermgmtbackend.repositories.UserRepository;
import com.exostar.usermgmtbackend.responses.UserResponse;
import com.exostar.usermgmtbackend.models.User;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserCSVController {

    @Autowired
    private UserRepository userRepository;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        log.info("Registering custom editor to trim strings");
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    public List<User> parseCsv(MultipartFile file, MappingStrategy<User> strategy) throws IOException {
        log.info("Attempting to parsed CSV file with '{}' strategy class", strategy.getClass());
        strategy.setType(User.class);
        try (Reader reader = new InputStreamReader(file.getInputStream())) {
            List<User> users = new CsvToBeanBuilder<User>(reader)
                    .withMappingStrategy(strategy)
                    .build()
                    .parse();
            log.info("Successfully parsed CSV file");
            return users;
        }
    }
    
    @PostMapping("/upload-csv")
    public ResponseEntity<UserResponse> processCSV(
            @RequestHeader(value = "Origin") String origin, 
            @RequestParam("file") MultipartFile file) throws IOException {
        try {
            log.trace("Entering processCSV...");
            log.info("Processing CSV file...");
            List<User> users;
            try {
                users = parseCsv(file, new HeaderColumnNameMappingStrategy<>());
            } catch (Exception e) {
                log.error("An exception was thrown attempting to parse CSV data by binding to column headers.", e);
                log.warn("Attempt to parse file with header columns failed. Attempting to parse file by column position.");
                users = parseCsv(file, new ColumnPositionMappingStrategy<>());
            }
            userRepository.saveAllAndFlush(users);
            final HttpStatus status = HttpStatus.OK;
            final UserResponse response = new UserResponse(status,
                    Collections.singletonList("CSV file processed successfully"));

            // HttpHeaders headers = new HttpHeaders();
            // headers.set("Access-Control-Allow-Origin", "*");
            final ResponseEntity<UserResponse> re = new ResponseEntity<>(response, status);
            log.info("Successfully processed CSV file. Response {}", response);
            return re;
        } finally {
            log.trace("Exiting processCSV...");
        }
    }
}
