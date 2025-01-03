package com.cs506.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    private int itemId;         // ID of the item
    private int stageId;      // ID of the stage
    private long userId;      // ID of the user
    private String title;        // Title of the item
    private String description;  // Description of the item
    private LocalDateTime dueDate; // When this item is due
}
