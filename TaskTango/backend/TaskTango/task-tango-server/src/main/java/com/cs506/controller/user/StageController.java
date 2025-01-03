package com.cs506.controller.user;

import com.cs506.context.BaseContext;
import com.cs506.dto.StageBodyRequest;
import com.cs506.dto.StageRequest;
import com.cs506.dto.TaskStageRequest;
import com.cs506.entity.Item;
import com.cs506.entity.LabelList;
import com.cs506.entity.Stage;
import com.cs506.exception.DataNotFoundException;
import com.cs506.service.ItemService;
import com.cs506.service.LabelListService;
import com.cs506.service.LabelService;
import com.cs506.service.StageService;
import com.cs506.service.GetStageService;
import com.cs506.vo.*;
import com.cs506.result.Result;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/stages")
public class StageController {
    private final StageService stageService;
    private final GetStageService getStageService;
    private final ItemService itemService;
    private final LabelService labelService;
    private final LabelListService labelListService;

    public StageController(StageService stageService, GetStageService getStageService,
                           ItemService itemService, LabelService labelService, LabelListService labelListService) {
        this.stageService = stageService;
        this.getStageService = getStageService;
        this.itemService = itemService;
        this.labelService = labelService;
        this.labelListService = labelListService;
    }

    // Get Stage by ID
    @GetMapping("/{stageId}")
    public Result<GetStageVO> getStageByID(@PathVariable int stageId) {
        log.info("GetStageByID: {}", stageId);
        StageVO stageVO = stageService.findById(stageId);
        List<BoardTaskVO> boardTaskVOList = getStageService.getStagesAndTasks(stageId);
        GetStageVO getStageVO = GetStageVO.builder().items(boardTaskVOList).build();
        BeanUtils.copyProperties(stageVO, getStageVO);
        return Result.success(getStageVO, "Stage found");
    }

    // Get All Stages
    @GetMapping()
    public Result<List<GetStageVO>> getAllStages() {
        log.info("GetAllStages");
        List<StageVO> allStageVOs = stageService.findAll();
        List<GetStageVO> getStageVOList = new ArrayList<>();
        for (StageVO stageVO : allStageVOs) {
            List<BoardTaskVO> boardTaskVOList = getStageService.getStagesAndTasks(stageVO.getStageId());
            GetStageVO getStageVO = GetStageVO.builder().items(boardTaskVOList).build();
            BeanUtils.copyProperties(stageVO, getStageVO);
            getStageVOList.add(getStageVO);
        }

        return Result.success(getStageVOList, "Stages retrieved");
    }


    // Create a stage
    @PostMapping
    public Result<StageVO> createStage(@RequestBody StageRequest stageRequest) {
        log.info("CreateLabel: {}", stageRequest);

        Stage sameName = stageService.findByBoardAndTitle(stageRequest.getBoardId(), stageRequest.getTitle().trim());

        if(sameName != null) {
            return Result.error("Stage already exists");
        }

        StageVO newStage = stageService.insert(Stage.builder()
                .boardId(stageRequest.getBoardId())
                .userId(BaseContext.getCurrentId())
                .title(stageRequest.getTitle())
                .description(stageRequest.getDescription())
                .build());

        return Result.success(newStage, "Created Stage");
    }

    // Update a stage's body
    @PutMapping("/{stageId}")
    public Result<StageVO> updateStageBody(@PathVariable int stageId, @RequestBody StageBodyRequest stageBodyRequest) {
        log.info("StageUpdate: {}", stageBodyRequest);

        StageVO stageVO = stageService.findById(stageId);

        Stage sameName = stageService.findByBoardAndTitle(stageVO.getBoardId(), stageBodyRequest.getTitle().trim());

        if(sameName != null) {
            return Result.error("Stage with that name already exists");
        }

        Stage stage = Stage.builder()
                .stageId(stageId)
                .userId(BaseContext.getCurrentId())
                .boardId(stageVO.getBoardId())
                .title(stageBodyRequest.getTitle())
                .description(stageBodyRequest.getDescription())
                .build();
        stageService.update(stage);
        BeanUtils.copyProperties(stage, stageVO);

        return Result.success(stageVO,"Stage updated successfully");
    }

    @PutMapping("/change/{taskId}")
    public Result<TaskVO> updateTaskStage(@PathVariable int taskId, @RequestBody TaskStageRequest taskStageRequest) {
        log.info("UpdateTaskStage: {} to {}", taskId, taskStageRequest);

        ItemVO itemVO = itemService.findById(taskId);

        Item item = Item.builder().itemId(taskId)
                .title(itemVO.getTitle())
                .description(itemVO.getDescription())
                .dueDate(itemVO.getDueDate())
                .stageId(taskStageRequest.getStageId())
                .build();
        itemService.update(item);
        BeanUtils.copyProperties(item, itemVO);

        List<LabelVO> labels = new ArrayList<>();
        try {
            List<LabelList> labelList = labelListService.findByItem(taskId);
            for (LabelList labelListItem : labelList) {
                LabelVO newLabel = labelService.findById(labelListItem.getLabelId());
                labels.add(newLabel);
            }
        } catch (DataNotFoundException ex){

        }
        TaskVO taskVO = TaskVO.builder().labels(labels).build();
        BeanUtils.copyProperties(itemVO, taskVO);

        return Result.success(taskVO,"Stage of "+taskId+" changed successfully");
    }

    @DeleteMapping("/{stageId}")
    public Result<StageVO> deleteStage(@PathVariable int stageId) {
        log.info("DeleteStage: {}", stageId);
        stageService.delete(stageId);
        return Result.success();
    }
}
