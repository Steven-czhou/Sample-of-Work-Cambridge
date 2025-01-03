package com.cs506.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StageVO {

    private int stageId;    // ID of the stage
    private int boardId;    // ID of the board of the stage
    private String title;    // Title of the stage
    private String description; // Description of the stage
}
