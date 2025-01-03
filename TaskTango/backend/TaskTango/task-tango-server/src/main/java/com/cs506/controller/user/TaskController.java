package com.cs506.controller.user;

import com.cs506.context.BaseContext;
import com.cs506.dto.TaskLabelsRequest;
import com.cs506.dto.TaskBodyRequest;
import com.cs506.dto.TaskRequest;
import com.cs506.entity.Item;
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
@RequestMapping("/v1/tasks")
public class TaskController {
    private final ItemService itemService;
    private final LabelService labelService;
    private final LabelListService labelListService;

    public TaskController(ItemService itemService, LabelService labelService, LabelListService labelListService) {
        this.itemService = itemService;
        this.labelService = labelService;
        this.labelListService = labelListService;
    }

    @GetMapping("/{taskId}")
    public Result<TaskVO> getTask(@PathVariable int taskId) {
        log.info("GetTask: {}", taskId);
        ItemVO itemVO = itemService.findById(taskId);
        List<LabelVO> labels = new ArrayList<>();
        try {
            List<LabelList> labelList = labelListService.findByItem(taskId);
            for (LabelList labelListItem : labelList) {
                LabelVO newLabel = labelService.findById(labelListItem.getLabelId());
                labels.add(newLabel);
            }
        } catch (DataNotFoundException ex) {

        }
        TaskVO taskVO = TaskVO.builder().labels(labels).build();
        BeanUtils.copyProperties(itemVO, taskVO);
        return Result.success(taskVO,"Task found");
    }

    @GetMapping()
    public Result<List<TaskVO>> getAllTasks() {
        log.info("GetAllTasks");
        List<ItemVO> itemVOList = itemService.findAll();
        List<TaskVO> taskVOList = new ArrayList<>();
        for(ItemVO itemVO : itemVOList) {
            List<LabelVO> labels = new ArrayList<>();
            try {
                List<LabelList> labelList = labelListService.findByItem(itemVO.getItemId());
                for (LabelList labelListItem : labelList) {
                    LabelVO newLabel = labelService.findById(labelListItem.getLabelId());
                    labels.add(newLabel);
                }
            } catch (DataNotFoundException ex) {
                // Do nothing
            }
            TaskVO taskVO = TaskVO.builder().labels(labels).build();
            BeanUtils.copyProperties(itemVO, taskVO);
            taskVOList.add(taskVO);
        }
        return Result.success(taskVOList,"Tasks retrieved");
    }

    @PostMapping
    public Result<ItemVO> createTask(@RequestBody TaskRequest taskRequest) {
        log.info("CreateTask: {}", taskRequest);
        log.info("{}",taskRequest.getStageId());

        Item sameName = itemService.findTitleFromBoard(taskRequest.getStageId(),taskRequest.getTitle().trim());
        if(sameName != null) {
            return Result.error("Item with that name exists!");
        }

        Item item = Item.builder()
                .stageId(taskRequest.getStageId())
                .userId(BaseContext.getCurrentId())
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .dueDate(taskRequest.getDueDate())
                .build();
        itemService.insert(item);
        List<Label> labels = taskRequest.getLabels();
        if(labels != null) {
            for (Label label : labels) {
                boolean sameFound = false;
                boolean nullName = false;
                try {
                    labelService.findById(label.getLabelId());
                } catch (DataNotFoundException ex) {
                    if(label.getName() != null && label.getName() != "") {
                        Label sameLabel = labelService.findByName(label.getName().trim());
                        if (sameLabel == null) {
                            labelService.insert(label);
                        } else {
                            sameFound = true;
                        }
                    }else{
                        nullName = true;
                    }
                }
                if(!sameFound && !nullName) {
                    labelListService.insert(LabelList.builder().labelId(label.getLabelId()).itemId(item.getItemId()).build());
                }
            }
        }
        ItemVO itemVO = ItemVO.builder().itemId(item.getItemId()).build();
        BeanUtils.copyProperties(item, itemVO);

        return Result.success(itemVO,"Created task");
    }

    @PutMapping("/{taskId}")
    public Result<TaskVO> updateTaskBody(@PathVariable int taskId, @RequestBody TaskBodyRequest taskBodyRequest) {
        log.info("UpdateTaskBody: {} to {}", taskId, taskBodyRequest);


        ItemVO itemVO = itemService.findById(taskId);

        Item sameName = itemService.findTitleFromBoard(itemVO.getStageId(),taskBodyRequest.getTitle().trim());
        if(sameName != null && sameName.getItemId() != taskId) {
            return Result.error("Item with that name exists!");
        }

        Item item = Item.builder()
                .itemId(taskId)
                .userId(BaseContext.getCurrentId())
                .title(taskBodyRequest.getTitle())
                .description(taskBodyRequest.getDescription())
                .dueDate(taskBodyRequest.getDueDate())
                .stageId(itemVO.getStageId())
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
        } catch (DataNotFoundException ex) {

        }
        TaskVO taskVO = TaskVO.builder().labels(labels).build();
        BeanUtils.copyProperties(itemVO, taskVO);

        return Result.success(taskVO,"Task updated successfully");
    }

    @PutMapping("/addlabels/{taskId}")
    public Result<TaskVO> addLabelsToTask(@PathVariable int taskId, @RequestBody TaskLabelsRequest taskLabelsRequest) {
        log.info("AddLabelsToTask: {} to {}", taskLabelsRequest, taskId);

        ItemVO itemVO = itemService.findById(taskId);

        List<Label> labels = taskLabelsRequest.getLabels();
        for (Label label : labels) {
            boolean sameFound = false;
            try {
                labelService.findById(label.getLabelId());
            } catch (DataNotFoundException ex) {
                Label sameName = labelService.findByName(label.getName().trim());
                if(sameName == null) {
                    labelService.insert(label);
                } else {
                    sameFound = true;
                }
            }
            try {
                labelListService.findByLabelAndItem(label.getLabelId(), itemVO.getItemId());
            } catch (DataNotFoundException ex) {
                if(!sameFound){
                    labelListService.insert(LabelList.builder().labelId(label.getLabelId()).itemId(itemVO.getItemId()).build());
                }
            }
        }

        List<LabelVO> labelVOList = new ArrayList<>();
        try {
            List<LabelList> labelList = labelListService.findByItem(taskId);
            for (LabelList labelListItem : labelList) {
                LabelVO newLabel = labelService.findById(labelListItem.getLabelId());
                labelVOList.add(newLabel);
            }
        } catch (DataNotFoundException ex) {

        }
        TaskVO taskVO = TaskVO.builder().labels(labelVOList).build();
        BeanUtils.copyProperties(itemVO, taskVO);

        return Result.success(taskVO,"Label added to "+taskId+" successfully");
    }

    @PutMapping("/removelabels/{taskId}")
    public Result<TaskVO> removeTaskLabels(@PathVariable int taskId, @RequestBody TaskLabelsRequest taskLabelsRequest) {
        log.info("RemoveTaskLabels: {} from {}", taskLabelsRequest, taskId);

        ItemVO itemVO = itemService.findById(taskId);

        List<Label> labels = taskLabelsRequest.getLabels();
        for (Label label : labels) {
            try {
                LabelList labelList = labelListService.findByLabelAndItem(label.getLabelId(), taskId);
                labelService.delete(labelList.getLabellistId());
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
        } catch (DataNotFoundException ex) {

        }
        TaskVO taskVO = TaskVO.builder().labels(labelVOList).build();
        BeanUtils.copyProperties(itemVO, taskVO);

        return Result.success(taskVO,"Labels removed from "+taskId+" successfully");
    }

    @DeleteMapping("/{taskId}")
    public Result<TaskVO> deleteTask(@PathVariable int taskId) {
        log.info("DeleteTask: {}", taskId);
        try {
            List<LabelList> labelList = labelListService.findByItem(taskId);
            for (LabelList labelListItem : labelList) {
                labelListService.delete(labelListItem.getLabellistId());
            }
        } catch (DataNotFoundException ex) {

        }
        itemService.delete(taskId);
        return Result.success();
    }

}
