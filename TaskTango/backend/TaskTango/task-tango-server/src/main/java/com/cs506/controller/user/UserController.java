package com.cs506.controller.user;

import com.cs506.constant.JwtClaimsConstant;
import com.cs506.constant.MessageConstant;
import com.cs506.context.BaseContext;
import com.cs506.dto.LoginRequest;
import com.cs506.dto.RegisterRequest;
import com.cs506.entity.User;
import com.cs506.exception.AccountNotFoundException;
import com.cs506.exception.PasswordErrorException;
import com.cs506.result.Result;
import com.cs506.service.UserService;
import com.cs506.utils.JwtUtil;
import com.cs506.vo.UserVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import com.cs506.properties.JwtProperties;
import com.cs506.vo.UserLoginVO;
import org.springframework.util.DigestUtils;

@Slf4j
@RestController
@RequestMapping("/v1/auth")
public class UserController {

    private final UserService userService;

    private final JwtProperties jwtProperties;

    public UserController(UserService userService, JwtProperties jwtProperties) {
        this.userService = userService;
        this.jwtProperties = jwtProperties;
    }

    // Login
    @PostMapping("/login")
    public Result<UserLoginVO> loginUser(@RequestBody LoginRequest loginRequest) {
        log.info("User Login: {}", loginRequest);
        String username = loginRequest.getUsername();
        if(username == null || userService.findByUsername(username) == null) {
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }

        UserVO userVO = userService.findByUsername(username);
        if(userVO.getPassword() == null ||
                !userVO.getPassword().equals(DigestUtils.md5DigestAsHex(loginRequest.getPassword().getBytes()))) {
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtClaimsConstant.USER_ID, userVO.getUserId());
        String token = JwtUtil.createJWT(jwtProperties.getUserSecretKey(), jwtProperties.getUserTtl(), claims);

        UserLoginVO userLoginVo = UserLoginVO.builder()
                .id(userVO.getUserId())
                .token(token)
                .build();

        return Result.success(userLoginVo);
    }

    // Register
    @PostMapping("/register")
    public Result<UserVO> registerUser(@RequestBody RegisterRequest registerRequest) {
        log.info("UserRegister: {}", registerRequest);
        String username = registerRequest.getUsername();
        if(username == null || userService.findByUsername(username) != null) {
            return Result.error("Username not allowed!");
        }
        String password = registerRequest.getPassword();
        if(password == null) {
            return Result.error("Password is required!");
        }
        String email = registerRequest.getEmail();
        if(email == null) {
            return Result.error("Email is required!");
        }
        String phone = registerRequest.getPhone();
        if(phone == null) {
            return Result.error("Phone is required!");
        }
        String userType = registerRequest.getUserType();
        if(userType == null) {
            return Result.error("UserType is required!");
        }

        User user = User.builder()
                .username(username)
                .password(DigestUtils.md5DigestAsHex(password.getBytes()))
                .email(email)
                .phone(phone)
                .userType(userType)
                .build();

        UserVO userVO = userService.insert(user);

        return Result.success(userVO, "User registered successfully");
    }

    @DeleteMapping("/delete")
    public Result<UserVO> deleteUser() {
        Long currentId = BaseContext.getCurrentId();
        log.info("DeleteUser: {}", currentId);
        userService.delete(currentId);
        return Result.success(null, "Account deleted successfully");
    }
}
