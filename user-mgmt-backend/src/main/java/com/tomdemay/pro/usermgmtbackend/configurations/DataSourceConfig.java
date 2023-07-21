package com.tomdemay.pro.usermgmtbackend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${PORTFOLIO_RDS_ENDPOINT}")
    private String rds_endpoint;

    @Value("${PORTFOLIO_RDS_PROTOCOL}")
    private String rds_protocol;

    @Value("${PORTFOLIO_RDS_BACKEND_USERNAME}")
    private String rds_username;

    @Value("${PORTFOLIO_RDS_BACKEND_PASSWORD}")
    private String rds_password;

    private String getConnectionString() {
        return String.format("jdbc:%s://%s:3306/user_mgmt_portal_db", rds_protocol, rds_endpoint);
    }

    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
                .url(getConnectionString())
                .username(rds_username)
                .password(rds_password)
                .build();
    }
}
