package com.cs506.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stage {

    private int stageId;    // ID of the stage
    private int boardId;  // ID of the board
    private long userId;  // ID of the user
    private String title;    // Title of the stage
    private String description; // Description of the stage
}
