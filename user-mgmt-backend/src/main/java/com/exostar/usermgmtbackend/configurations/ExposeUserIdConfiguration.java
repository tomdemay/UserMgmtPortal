package com.exostar.usermgmtbackend.configurations;

import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.exostar.usermgmtbackend.models.User;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ExposeUserIdConfiguration implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        log.info("Setting configuration to expose identifiers");
        config.exposeIdsFor(User.class);
    }
}