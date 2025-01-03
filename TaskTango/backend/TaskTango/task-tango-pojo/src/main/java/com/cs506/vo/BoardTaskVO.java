package com.cs506.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BoardTaskVO {
    private int itemId;
    private String title;
    private String description;
    private List<LabelVO> labels; // TODO: Do we need to keep this?
    private LocalDateTime dueDate;
}
