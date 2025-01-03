package com.cs506.service;

import com.cs506.context.BaseContext;
import com.cs506.entity.Item;
import com.cs506.entity.Stage;
import com.cs506.exception.DataNotFoundException;
import com.cs506.mapper.ItemMapper;
import com.cs506.vo.ItemVO;
import com.cs506.vo.StageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ItemService {
    private final ItemMapper itemMapper;
    private final StageService stageService;

    @Autowired
    public ItemService(ItemMapper itemMapper, StageService stageService) {
        this.itemMapper = itemMapper;
        this.stageService = stageService;
    }

    public ItemVO findById(int item_id) {
        Item item = itemMapper.findById(item_id,BaseContext.getCurrentId());
        if (item == null) {
            throw new DataNotFoundException("Task not found");
        }
        return ItemVO.builder()
                .description(item.getDescription())
                .title(item.getTitle())
                .itemId(item.getItemId())
                .stageId(item.getStageId())
                .dueDate(item.getDueDate())
                .build();
    }

    public List<ItemVO> findAll() {
        List<Item> allItems = itemMapper.findAll(BaseContext.getCurrentId());
        if (allItems == null) {
            throw new DataNotFoundException("No tasks exist");
        }
        List<ItemVO> itemVOList = new ArrayList<>();
        for (Item item : allItems) {
            itemVOList.add(ItemVO.builder()
                    .description(item.getDescription())
                    .title(item.getTitle())
                    .itemId(item.getItemId())
                    .stageId(item.getStageId())
                    .dueDate(item.getDueDate())
                    .build());
        }
        return itemVOList;
    }
    
    public List<Item> findByStage(int stageId) {
        List<Item> allItems = itemMapper.findByStage(stageId, BaseContext.getCurrentId());
        if (allItems == null) {
            throw new DataNotFoundException("No tasks exist on that stage");
        }
        return allItems;
    }

    public void insert(Item item) {
        itemMapper.insert(item);
    }

    public void update(Item item) {
        itemMapper.update(item);
    }

    public void delete(int itemId) {
        itemMapper.delete(itemId);
    }

    public Item findTitleFromBoard(int stageId,String title) {
        StageVO stage = stageService.findById(stageId);
        List<Stage> boardStages = stageService.findByBoard(stage.getBoardId());
        for(Stage boardStage : boardStages){
            List<Item> tasks = findByStage(boardStage.getStageId());
            for(Item item : tasks){
                if(item.getTitle().equals(title)){
                    return item;
                }
            }
        }
        return null;
    }

}

