// TODO
package com.cs506.config;

import com.cs506.interceptor.JwtTokenUserInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

/**
 * Configuration class to register web tier related components
 */
@Configuration
@Slf4j
public class WebMvcConfiguration extends WebMvcConfigurationSupport {

    private JwtTokenUserInterceptor jwtTokenUserInterceptor;

    public WebMvcConfiguration(JwtTokenUserInterceptor jwtTokenUserInterceptor) {
        this.jwtTokenUserInterceptor = jwtTokenUserInterceptor;
    }

    /**
     * Register custom interceptor
     *
     * @param registry
     */
    protected void addInterceptors(InterceptorRegistry registry) {
        log.info("Register custom interceptor...");

        registry.addInterceptor(jwtTokenUserInterceptor)
                .addPathPatterns("/v1/**")
                .excludePathPatterns("/v1/auth/login")
                .excludePathPatterns("/v1/auth/register");

    }

    /**
     * Generate API doc via knife4j
     *
     * @return
     */
    @Bean
    public Docket docket1() {
        ApiInfo apiInfo = new ApiInfoBuilder()
                .title("TaskTango Doc Management")
                .version("1.0")
                .description("TaskTango Doc Management")
                .build();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .groupName("User API")
                .apiInfo(apiInfo)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.cs506.controller.user"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }

    /**
     * Generate API doc via knife4j
     *
     * @return
     */
    @Bean
    public Docket docket2() {
        ApiInfo apiInfo = new ApiInfoBuilder()
                .title("TaskTango Doc Management")
                .version("1.0")
                .description("TaskTango Doc Management")
                .build();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .groupName("Admin API")
                .apiInfo(apiInfo)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.cs506.controller.admin"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }

    /**
     * Setting up static resource mapping
     *
     * @param registry
     */
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

}
