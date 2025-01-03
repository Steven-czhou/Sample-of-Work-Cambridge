package com.cs506.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private long userId;       // ID of the user
    private String username;   // Username
    private String password;   // Password
    private String email;      // Email address
    private String phone;      // Phone number
    private String userType;  // Type of user (e.g., admin, regular)

}
