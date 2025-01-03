package com.cs506.service;


import com.cs506.entity.Stage;
import com.cs506.exception.DataNotFoundException;
import com.cs506.mapper.BoardMapper;
import com.cs506.mapper.ItemMapper;
import com.cs506.vo.BoardTaskVO;
import com.cs506.vo.BoardStageVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GetBoardService extends BoardService {

    private final GetStageService getStageService;
    StageService stageService;
    ItemService itemService;
    LabelListService labelListService;
    LabelService labelService;

    @Autowired
    public GetBoardService(BoardMapper boardMapper, ItemMapper itemMapper, StageService stageService,
                           ItemService itemService, LabelListService labelListService,
                           LabelService labelService, GetStageService getStageService) {
        super(boardMapper,stageService,itemMapper);
        this.stageService = stageService;
        this.itemService = itemService;
        this.labelListService = labelListService;
        this.labelService = labelService;
        this.getStageService = getStageService;
    }

    public List<BoardStageVO> getBoardStagesAndTasks(int boardId) {
        List<BoardStageVO> boardStageVOList = new ArrayList<>();
        try {
            List<Stage> stageList = stageService.findByBoard(boardId);
            for (Stage stage : stageList) {
                List<BoardTaskVO> taskVOList = getStageService.getStagesAndTasks(stage.getStageId());
                BoardStageVO boardStageVO = BoardStageVO.builder().items(taskVOList).build();
                BeanUtils.copyProperties(stage, boardStageVO);
                boardStageVOList.add(boardStageVO);
            }
        } catch (DataNotFoundException ex){

        }
        return boardStageVOList;
    }

}
