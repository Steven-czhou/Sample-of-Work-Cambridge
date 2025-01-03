package com.cs506.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "cs506.jwt")
@Data
public class JwtProperties {

    /**
     * User JWT config
     */
    private String userSecretKey;
    private long userTtl;
    private String userTokenName;

}
