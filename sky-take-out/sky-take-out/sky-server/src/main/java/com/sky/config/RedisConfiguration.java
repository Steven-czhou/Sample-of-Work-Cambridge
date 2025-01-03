package com.sky.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@Slf4j
public class RedisConfiguration {

    @Bean
    public RedisTemplate redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        log.info("开始创建redis模板对象...");
        RedisTemplate redisTemplate = new RedisTemplate();
        // 设置 RedisTemplate 使用的连接工厂，这个工厂对象提供了 Redis 连接
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        // 设置 RedisTemplate 使用的键序列化器为 StringRedisSerializer，这意味着 Redis 中的键将被序列化为字符串格式
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        return redisTemplate;
    };


}
