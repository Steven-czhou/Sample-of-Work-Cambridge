package com.cs506.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TaskVO {
    private int itemId;
    private String title;
    private String description;
    private int stageId;
    private List<LabelVO> labels;
    private LocalDateTime dueDate;
}
