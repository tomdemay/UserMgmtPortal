package com.tomdemay.pro.usermgmtbackend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${CLEARDB_DATABASE_URL}")
    private String databaseUrl;

    @Value("${CLEARDB_DATABASE_USERNAME}")
    private String username;

    @Value("${CLEARDB_DATABASE_PASSWORD}")
    private String password;

    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
                .url("jdbc:"+databaseUrl)
                .username(username)
                .password(password)
                .build();
    }
}
