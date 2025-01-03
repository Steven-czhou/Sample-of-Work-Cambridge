package com.cs506.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardStageVO {

    private int stageId;    // ID of the stage
    private String title;    // Title of the stage
    private String description; // Description of the stage
    private List<BoardTaskVO> items; // List of tasks
}
