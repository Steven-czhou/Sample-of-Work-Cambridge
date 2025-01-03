package com.cs506.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabelRequest {
    private String name;    // Name of the label
    private String color;      // Color of the label
}
