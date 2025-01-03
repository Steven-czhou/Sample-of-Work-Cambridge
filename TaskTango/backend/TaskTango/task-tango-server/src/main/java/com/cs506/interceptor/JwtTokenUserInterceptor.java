package com.cs506.interceptor;

import com.cs506.constant.JwtClaimsConstant;
import com.cs506.context.BaseContext;
import com.cs506.properties.JwtProperties;
import com.cs506.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor for JWT token validation
 */
@Component
@Slf4j
public class JwtTokenUserInterceptor implements HandlerInterceptor {

    private final JwtProperties jwtProperties;

    public JwtTokenUserInterceptor(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    /**
     * Validate JWT
     *
     * @param request
     * @param response
     * @param handler
     * @return boolean
     * @throws Exception
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Check if the intercepted resource is a Controller method or another resource
        if (!(handler instanceof HandlerMethod)) {
            // If not a dynamic method, allow through
            return true;
        }
        // 1. Retrieve the token from the request header
        String token = request.getHeader(jwtProperties.getUserTokenName());

        // 2. Validate the token
        try {
            log.info("JWT validation: {}", token);
            if (token.startsWith("Bearer ")){
                token = token.substring(7);
            }
            Claims claims = JwtUtil.parseJWT(jwtProperties.getUserSecretKey(), token);
            Long userId = Long.valueOf(claims.get(JwtClaimsConstant.USER_ID).toString());
            log.info("Current user ID: {}", userId);
            BaseContext.setCurrentId(userId);
            // 3. Validation successful, allow through
            return true;
        } catch (Exception ex) {
            // 4. Validation failed, respond with 401 status code
            response.setStatus(401);
            return false;
        }
    }
}
