package com.cs506.service;

import com.cs506.entity.LabelList;
import com.cs506.exception.DataNotFoundException;
import com.cs506.mapper.LabelListMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LabelListService {
    private final LabelListMapper labelListMapper;

    @Autowired
    public LabelListService(LabelListMapper labelListMapper) {
        this.labelListMapper = labelListMapper;
    }

    public LabelList findById(int labellistId) {
        LabelList labelList = labelListMapper.findById(labellistId);

        if (labelList == null) {
            throw new DataNotFoundException("LabelList not found");
        }

        return labelList;
    }

    public LabelList findByLabelAndItem(int labelId, int itemId) {
        LabelList labelList = labelListMapper.findByLabelAndItem(labelId, itemId);

        if (labelList == null) {
            throw new DataNotFoundException("LabelList not found");
        }

        return labelList;
    }

    public List<LabelList> findAll() {
        List<LabelList> labelList = labelListMapper.findAll();

        if (labelList == null) {
            throw new DataNotFoundException("No LabelLists found");
        }

        return labelList;
    }
    
    public List<LabelList> findByLabel(int labelId) {
        List<LabelList> labelList = labelListMapper.findByLabel(labelId);

        if (labelList == null) {
            throw new DataNotFoundException("No LabelLists for that label found");
        }

        return labelList;
    }

    public List<LabelList> findByItem(int itemId) {
        List<LabelList> labelList = labelListMapper.findByItem(itemId);

        if (labelList == null) {
            throw new DataNotFoundException("No LabelLists for that item found");
        }

        return labelList;
    }

    public void insert(LabelList labelList) {
        labelListMapper.insert(labelList);
    }


    public void update(LabelList labelList) {
        labelListMapper.update(labelList);
    }

    public void delete(int labellistId) {
        labelListMapper.delete(labellistId);
    }

}

