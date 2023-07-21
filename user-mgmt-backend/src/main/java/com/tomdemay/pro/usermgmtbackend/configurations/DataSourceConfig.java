package com.tomdemay.pro.usermgmtbackend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${PORTFOLIO_RDS_BACKEND_USERNAME}")
    private String rds_username;

    @Value("${PORTFOLIO_RDS_BACKEND_PASSWORD}")
    private String rds_password;

    @Value("${PORTFOLIO_RDS_ENDPOINT}")
    private String rds_endpoint;

    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
                .url("jdbc:"+rds_endpoint)
                .username(rds_username)
                .password(rds_password)
                .build();
    }
}
