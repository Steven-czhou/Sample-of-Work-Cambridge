package com.cs506.service;

import com.cs506.entity.Item;
import com.cs506.entity.LabelList;
import com.cs506.exception.DataNotFoundException;
import com.cs506.mapper.StageMapper;
import com.cs506.mapper.ItemMapper;
import com.cs506.vo.BoardTaskVO;
import com.cs506.vo.ItemVO;
import com.cs506.vo.LabelVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GetStageService extends StageService {

    StageService stageService;
    ItemService itemService;
    LabelListService labelListService;
    LabelService labelService;

    @Autowired
    public GetStageService(StageMapper stageMapper, ItemMapper itemMapper, StageService stageService,
                           ItemService itemService, LabelListService labelListService, LabelService labelService) {
        super(stageMapper,itemMapper);
        this.stageService = stageService;
        this.itemService = itemService;
        this.labelListService = labelListService;
        this.labelService = labelService;
    }

    public List<BoardTaskVO> getStagesAndTasks(int stageId) {
            List<BoardTaskVO> taskVOList = new ArrayList<>();
            try {
                List<Item> taskList = itemService.findByStage(stageId);
                for (Item item : taskList) {
                    ItemVO itemVO = itemService.findById(item.getItemId());
                    List<LabelVO> labels = new ArrayList<>();
                    try {
                        List<LabelList> labelList = labelListService.findByItem(item.getItemId());
                        for (LabelList labelListItem : labelList) {
                            LabelVO newLabel = labelService.findById(labelListItem.getLabelId());
                            labels.add(newLabel);
                        }
                    } catch (DataNotFoundException e) {
                    }
                    BoardTaskVO boardTaskVO = BoardTaskVO.builder().labels(labels).build();
                    BeanUtils.copyProperties(itemVO, boardTaskVO);
                    taskVOList.add(boardTaskVO);
                }
            } catch (DataNotFoundException e) {
            }
            return taskVOList;
    }
}
