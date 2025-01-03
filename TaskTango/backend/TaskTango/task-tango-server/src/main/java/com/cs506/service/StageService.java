package com.cs506.service;

import com.cs506.context.BaseContext;
import com.cs506.entity.Stage;
import com.cs506.exception.DataNotFoundException;
import com.cs506.exception.DeletionNotAllowedException;
import com.cs506.mapper.ItemMapper;
import com.cs506.mapper.StageMapper;
import com.cs506.vo.StageVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StageService {
    private final StageMapper stageMapper;
    private final ItemMapper itemMapper;

    @Autowired
    public StageService(StageMapper stageMapper, ItemMapper itemMapper) {
        this.stageMapper = stageMapper;
        this.itemMapper = itemMapper;
    }

    public StageVO findById(int stageId) {
        Stage stage = stageMapper.findById(stageId,BaseContext.getCurrentId());

        if (stage == null) {
            throw new DataNotFoundException("No stage found");
        }

        StageVO stageVO = StageVO.builder().stageId(stageId).build();
        BeanUtils.copyProperties(stage, stageVO);
        return stageVO;
    }

    public List<StageVO> findAll() {
        List<Stage> allStages = stageMapper.findAll(BaseContext.getCurrentId());

        if(allStages == null){
            throw new DataNotFoundException("No stages found");
        }

        List<StageVO> stageVOList = new ArrayList<>();
        for(Stage stage : allStages) {
            stageVOList.add(StageVO.builder()
                    .stageId(stage.getStageId())
                    .boardId(stage.getBoardId())
                    .title(stage.getTitle())
                    .description(stage.getDescription())
                    .build());
        }
        return stageVOList;
    }
    
    public List<Stage> findByBoard(int boardId) {
        List<Stage> allStages = stageMapper.findByBoard(boardId,BaseContext.getCurrentId());

        if(allStages == null){
            throw new DataNotFoundException("No stages found");
        }

        return allStages;
    }

    public StageVO insert(Stage stage) {
        stageMapper.insert(stage);
        return StageVO.builder()
                .stageId(stage.getStageId())
                .boardId(stage.getBoardId())
                .title(stage.getTitle())
                .description(stage.getDescription()).build();
    }

    public void update(Stage stage) {
        stageMapper.update(stage);
    }

    public void delete(int stageId) {
        int count = itemMapper.findByStage(stageId,BaseContext.getCurrentId()).size();
        if (count > 0) {
            throw new DeletionNotAllowedException("There are still tasks in this stage");
        }
        stageMapper.delete(stageId);
    }

    public Stage findByBoardAndTitle(int boardId, String title) {
        return stageMapper.findByBoardAndTitle(boardId,title,BaseContext.getCurrentId());
    }

}

