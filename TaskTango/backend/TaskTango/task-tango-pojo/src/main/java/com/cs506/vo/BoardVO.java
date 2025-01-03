package com.cs506.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardVO {
    private int boardId; // ID of the Board
    private String title; // Title of the Board
}
