package com.cs506.mapper;

import com.cs506.entity.LabelList;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface LabelListMapper {
    @Select("SELECT * FROM LabelList WHERE labellist_id = #{labellistId}")
    LabelList findById(int labellistId);

    @Select("SELECT * FROM LabelList WHERE label_id = #{labelId} AND item_id = #{itemId}")
    LabelList findByLabelAndItem(int labelId, int itemId);

    @Select("SELECT * FROM LabelList")
    List<LabelList> findAll();

    @Select("SELECT * FROM LabelList WHERE label_id = #{labelId}")
    List<LabelList> findByLabel(int labelId);

    @Select("SELECT * FROM LabelList WHERE item_id = #{itemId}")
    List<LabelList> findByItem(int itemId);

    @Insert("INSERT INTO LabelList(label_id,item_id) VALUES(#{labelId},#{itemId})")
    @Options(useGeneratedKeys = true, keyProperty = "labellistId")
    void insert(LabelList labelList);

    @Update("UPDATE LabelList SET label_id=#{labelId},item_id=#{itemId} WHERE " +
            "labellist_id=#{labellistId}")
    void update(LabelList labelList);

    @Delete("DELETE FROM LabelList WHERE labellist_id = #{labellistId}")
    void delete(int labellistId);
}