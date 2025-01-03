package com.cs506.service;

import com.cs506.context.BaseContext;
import com.cs506.entity.Label;
import com.cs506.exception.DataNotFoundException;
import com.cs506.exception.DeletionNotAllowedException;
import com.cs506.mapper.LabelListMapper;
import com.cs506.mapper.LabelMapper;
import com.cs506.vo.LabelVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LabelService {
    private final LabelMapper labelMapper;
    private final LabelListMapper labelListMapper;

    @Autowired
    public LabelService(LabelMapper labelMapper, LabelListMapper labelListMapper) {
        this.labelMapper = labelMapper;
        this.labelListMapper = labelListMapper;
    }

    public LabelVO findById(int labelId) {
        Label label = labelMapper.findById(labelId,BaseContext.getCurrentId());

        if (label == null) {
            throw new DataNotFoundException("No label found");
        }

        return LabelVO.builder()
                .labelId(label.getLabelId())
                .name(label.getName())
                .color(label.getColor())
                .build();
    }

    public List<LabelVO> findAll() {
        List<Label> labelList = labelMapper.findAll(BaseContext.getCurrentId());

        if (labelList == null) {
            throw new DataNotFoundException("No labels found");
        }

        List<LabelVO> labelVOList = new ArrayList<>();
        for (Label label : labelList) {
            labelVOList.add(LabelVO.builder()
                    .labelId(label.getLabelId())
                    .name(label.getName())
                    .color(label.getColor())
                    .build());
        }
        return labelVOList;
    }

    public void insert(Label label) {
        labelMapper.insert(label);
    }

    public void update(Label label) {
        labelMapper.update(label);
    }

    public void delete(int labelId) {
        int count = labelListMapper.findByLabel(labelId).size();
        if (count > 0) {
            throw new DeletionNotAllowedException("There are still tasks associated with this label");
        }
        labelMapper.delete(labelId);
    }

    public Label findByName(String name){
        return labelMapper.findByName(name,BaseContext.getCurrentId());
    }

}

