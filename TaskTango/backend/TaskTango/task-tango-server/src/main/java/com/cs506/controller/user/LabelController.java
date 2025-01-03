package com.cs506.controller.user;

import com.cs506.context.BaseContext;
import com.cs506.dto.LabelRequest;
import com.cs506.dto.TaskLabelsRequest;
import com.cs506.entity.Label;
import com.cs506.entity.LabelList;
import com.cs506.exception.DataNotFoundException;
import com.cs506.result.Result;
import com.cs506.service.ItemService;
import com.cs506.service.LabelListService;
import com.cs506.service.LabelService;

import com.cs506.vo.ItemVO;
import com.cs506.vo.LabelVO;
import com.cs506.vo.TaskVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/labels")
public class LabelController {
    private final LabelService labelService;
    private final ItemService itemService;
    private final LabelListService labelListService;

    public LabelController(LabelService labelService, ItemService itemService, LabelListService labelListService) {
        this.labelService = labelService;
        this.itemService = itemService;
        this.labelListService = labelListService;
    }

    @GetMapping("/{labelId}")
    public Result<LabelVO> getLabel(@PathVariable int labelId) {
        log.info("GetLabel: {}", labelId);
        LabelVO labelVO = labelService.findById(labelId);
        return Result.success(labelVO,"Label found");
    }

    @GetMapping()
    public Result<List<LabelVO>> getAllLabels() {
        log.info("GetAllLabels");
        List<LabelVO> labelVOList = labelService.findAll();
        return Result.success(labelVOList,"Labels retrieved");
    }

    @PostMapping
    public Result<LabelVO> createLabel(@RequestBody LabelRequest labelRequest) {
        log.info("CreateLabel: {}", labelRequest);

        Label sameName = labelService.findByName(labelRequest.getName().trim());
        if(sameName != null){
            return Result.error("A Label Exists With that Name!");
        }

        Label label = Label.builder()
                .userId(BaseContext.getCurrentId())
                .name(labelRequest.getName())
                .color(labelRequest.getColor())
                .build();
        labelService.insert(label);
        return Result.success(null,"Label created successfully");
    }

    @PutMapping("/{labelId}")
    public Result<LabelVO> updateLabels(@PathVariable int labelId, @RequestBody LabelRequest labelRequest) {
        log.info("UpdateLabel: {} to {}", labelId, labelRequest);

        Label sameName = labelService.findByName(labelRequest.getName().trim());
        if(sameName != null){
            return Result.error("A Label Exists With that Name!");
        }

        Label label = Label.builder()
                .labelId(labelId)
                .userId(BaseContext.getCurrentId())
                .name(labelRequest.getName())
                .color(labelRequest.getColor())
                .build();
        labelService.update(label);
        return Result.success(null,"Label updated successfully");
    }

    @PostMapping("/addlabels/{taskId}")
    public Result<TaskVO> addTaskLabels(@PathVariable int taskId, @RequestBody TaskLabelsRequest taskLabelsRequest) {
        log.info("AddLabelsToTask: {} to {}", taskLabelsRequest, taskId);

        ItemVO itemVO = itemService.findById(taskId);

        List<Label> labels = taskLabelsRequest.getLabels();
        for (Label label : labels) {
            try {
                labelService.findById(label.getLabelId());
            } catch (DataNotFoundException ex) {
                labelService.insert(label);
            }
            labelListService.insert(LabelList.builder().labelId(label.getLabelId()).itemId(itemVO.getItemId()).build());
        }

        List<LabelVO> labelVOList = new ArrayList<>();
        try {
            List<LabelList> labelList = labelListService.findByItem(taskId);
            for (LabelList labelListItem : labelList) {
                LabelVO newLabel = labelService.findById(labelListItem.getLabelId());
                labelVOList.add(newLabel);
            }
        } catch (DataNotFoundException ex) {}

        TaskVO taskVO = TaskVO.builder().labels(labelVOList).build();
        BeanUtils.copyProperties(itemVO, taskVO);

        return Result.success(taskVO,"Label added to "+taskId+" successfully");
    }

    @DeleteMapping("/removelabels/{taskId}")
    public Result<TaskVO> removeTaskLabels(@PathVariable int taskId, @RequestBody TaskLabelsRequest taskLabelsRequest) {
        log.info("RemoveTaskLabels: {} from {}", taskLabelsRequest, taskId);

        ItemVO itemVO = itemService.findById(taskId);

        List<Label> labels = taskLabelsRequest.getLabels();
        for (Label label : labels) {
            try {
                LabelList labelList = labelListService.findByLabelAndItem(label.getLabelId(), taskId);
                labelListService.delete(labelList.getLabellistId());
            } catch (DataNotFoundException ex) {
            }
        }

        List<LabelVO> labelVOList = new ArrayList<>();
        try {
            List<LabelList> itemLabels = labelListService.findByItem(taskId);
            for (LabelList labelListItem : itemLabels) {
                LabelVO newLabel = labelService.findById(labelListItem.getLabelId());
                labelVOList.add(newLabel);
            }
        } catch (DataNotFoundException ex) {}

        TaskVO taskVO = TaskVO.builder().labels(labelVOList).build();
        BeanUtils.copyProperties(itemVO, taskVO);

        return Result.success(taskVO,"Labels removed from "+taskId+" successfully");
    }

    @DeleteMapping("/{labelId}")
    public Result<LabelVO> deleteLabel(@PathVariable int labelId) {
        log.info("DeleteLabel: {}", labelId);
        labelService.delete(labelId);
        return Result.success();
    }

}
