package com.cs506.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemVO {
    private int itemId;         // ID of the item
    private int stageId;      // ID of the stage
    private String title;        // Title of the item
    private String description;  // Description of the item
    private LocalDateTime dueDate; // due date of the item

}
