package com.cs506.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GetBoardVO {
    private int boardId; // ID of the Board
    private String title; // Title of the Board
    private List<BoardStageVO> stages; // List of StageVOs on the Board
}
