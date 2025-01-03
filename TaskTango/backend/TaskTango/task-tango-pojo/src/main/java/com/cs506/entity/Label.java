package com.cs506.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Label {

    private int labelId;   // ID of the label
    private long userId;   // ID of the User
    private String name;    // Name of the label
    private String color;      // Color of the label
}
