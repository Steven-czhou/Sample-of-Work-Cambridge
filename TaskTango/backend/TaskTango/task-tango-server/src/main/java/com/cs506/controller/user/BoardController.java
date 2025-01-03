package com.cs506.controller.user;

import com.cs506.context.BaseContext;
import com.cs506.dto.BoardRequest;
import com.cs506.service.GetBoardService;
import com.cs506.vo.*;
import com.cs506.entity.Board;
import com.cs506.service.BoardService;
import com.cs506.result.Result;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/boards")
public class BoardController {
    private final BoardService boardService;
    private final GetBoardService getBoardService;

    public BoardController(BoardService boardService, GetBoardService getBoardService) {
        this.boardService = boardService;
        this.getBoardService = getBoardService;
    }

    // Get Board by ID
    @GetMapping("/{boardId}")
    public Result<GetBoardVO> getBoardByID(@PathVariable int boardId) {
        log.info("GetBoardByID: {}", boardId);
        BoardVO boardVO = boardService.findById(boardId);
        List<BoardStageVO> boardStageVOList = getBoardService.getBoardStagesAndTasks(boardId);
        GetBoardVO getBoardVO = GetBoardVO.builder().stages(boardStageVOList).build();
        BeanUtils.copyProperties(boardVO, getBoardVO);
        return Result.success(getBoardVO, "Board found");
    }

    // Get All Boards
    @GetMapping()
    public Result<List<GetBoardVO>> getAllBoards() {
        log.info("GetAllBoards");
        List<BoardVO> allBoardVOs = boardService.findAll();
        List<GetBoardVO> getBoardVOList = new ArrayList<>();
        for (BoardVO boardVO : allBoardVOs) {
            List<BoardStageVO> boardStageVOList = getBoardService.getBoardStagesAndTasks(boardVO.getBoardId());
            GetBoardVO getBoardVO = GetBoardVO.builder().stages(boardStageVOList).build();
            BeanUtils.copyProperties(boardVO, getBoardVO);
            getBoardVOList.add(getBoardVO);
        }

        return Result.success(getBoardVOList, "Boards retrieved");
    }


    // Create a board
    @PostMapping
    public Result<BoardVO> createBoard(@RequestBody BoardRequest boardRequest) {
        log.info("CreateBoard: {}", boardRequest);

        Board sameName = boardService.findByTitle(boardRequest.getTitle().trim());
        if (sameName != null) {
            return Result.error("Board already exists");
        }

        BoardVO newBoard = boardService.insert(Board.builder()
                .userId(BaseContext.getCurrentId())
                .title(boardRequest.getTitle()).build());

        return Result.success(newBoard, "Created Board");
    }

    // Update a board's name
    @PutMapping("/{boardId}")
    public Result<Board> updateBoard(@PathVariable int boardId, @RequestBody BoardRequest boardRequest) {
        log.info("BoardUpdate: {}", boardRequest);
        String title = boardRequest.getTitle();
        if(title == null) {
            return Result.error("Invalid title");
        }

        Board sameName = boardService.findByTitle(boardRequest.getTitle().trim());
        if (sameName != null) {
            return Result.error("Board already exists");
        }

        Board board = Board.builder()
                .boardId(boardId)
                .userId(BaseContext.getCurrentId())
                .title(title).build();
        boardService.update(board);
        return Result.success(board,"Board updated successfully");
    }

    @DeleteMapping("/{boardId}")
    public Result<Board> deleteBoard(@PathVariable int boardId) {
        log.info("DeleteBoard: {}", boardId);
        boardService.delete(boardId);
        return Result.success();
    }
}
