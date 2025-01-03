package com.cs506.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabelList {

    private int labellistId; // ID of the labelList
    private int labelId;     // ID of the label
    private int itemId;     // ID of the item
}
