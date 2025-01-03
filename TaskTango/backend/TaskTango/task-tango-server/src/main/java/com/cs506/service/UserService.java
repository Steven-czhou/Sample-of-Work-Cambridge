package com.cs506.service;

import com.cs506.entity.User;
import com.cs506.mapper.UserMapper;
import com.cs506.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.List;

@Service
public class UserService {
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public User findById(long userId) {
        return userMapper.findById(userId);
    }

    public List<User> findAll() {
        return userMapper.findAll();
    }

    public UserVO findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public UserVO insert(User user) {
        userMapper.insert(user);
        return UserVO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .password(user.getPassword())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType()).build();
    }

    public void update(User user) {
        userMapper.update(user);
    }

    public void delete(long userId) {
        userMapper.delete(userId);
    }

}

