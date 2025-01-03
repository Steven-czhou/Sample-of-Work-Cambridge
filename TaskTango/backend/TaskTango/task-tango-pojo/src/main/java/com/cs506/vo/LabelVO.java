package com.cs506.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabelVO {

    private int labelId;   // ID of the label
    private String name;    // Name of the label
    private String color;      // Color of the label
}
