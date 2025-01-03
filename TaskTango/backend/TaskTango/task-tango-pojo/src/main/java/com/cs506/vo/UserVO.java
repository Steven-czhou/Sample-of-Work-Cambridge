package com.cs506.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserVO {
    private long userId;       // ID of the user
    private String username;   // Username
    private String password;   // Password
    private String email;      // Email address
    private String phone;      // Phone number
    private String userType;  // Type of user (e.g., admin, regular)

}
