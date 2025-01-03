package com.cs506.service;

import com.cs506.context.BaseContext;
import com.cs506.entity.Board;
import com.cs506.entity.Stage;
import com.cs506.exception.DataNotFoundException;
import com.cs506.exception.DeletionNotAllowedException;
import com.cs506.mapper.BoardMapper;
import com.cs506.mapper.ItemMapper;
import com.cs506.vo.BoardVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BoardService {
    private final BoardMapper boardMapper;
    private final ItemMapper itemMapper;
    private final StageService stageService;

    @Autowired
    public BoardService(BoardMapper boardMapper, StageService stageService, ItemMapper itemMapper) {
        this.boardMapper = boardMapper;
        this.stageService = stageService;
        this.itemMapper = itemMapper;
    }

    public BoardVO findById(int boardId) {
        Board board = boardMapper.findById(boardId, BaseContext.getCurrentId());
        if (board == null) {
            throw new DataNotFoundException("No board found");
        }

        return BoardVO.builder()
                .boardId(board.getBoardId())
                .title(board.getTitle())
                .build();
    }

    public List<BoardVO> findAll() {
        List<Board> allBoards = boardMapper.findAll(BaseContext.getCurrentId());

        if (allBoards == null) {
            throw new DataNotFoundException("No boards found");
        }

        List<BoardVO> boardVOList = new ArrayList<>();
        for(Board board : allBoards) {
            boardVOList.add(BoardVO.builder()
                    .boardId(board.getBoardId())
                    .title(board.getTitle())
                    .build());
        }
        return boardVOList;
    }

    public BoardVO insert(Board board) {
        boardMapper.insert(board);
        return BoardVO.builder()
                .boardId(board.getBoardId())
                .title(board.getTitle())
                .build();
    }

    public void update(Board board) {
        boardMapper.update(board);
    }

    public void delete(int boardId) {
        List<Stage> stages = stageService.findByBoard(boardId);
        for(Stage stage : stages) {
            int count = itemMapper.findByStage(stage.getStageId(),BaseContext.getCurrentId()).size();
            if (count > 0) {
                throw new DeletionNotAllowedException("There are still tasks in this Board");
            }
        }
        for(Stage stage : stages) {
            stageService.delete(stage.getStageId());
        }
        boardMapper.delete(boardId);
    }

    public Board findByTitle(String title) {
        return boardMapper.findByTitle(title, BaseContext.getCurrentId());
    }

}

