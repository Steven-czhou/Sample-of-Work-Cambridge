package com.cs506.mapper;

import com.cs506.entity.Item;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ItemMapper {
    @Select("SELECT * FROM Item WHERE item_id = #{itemId} AND user_id = #{userId}")
    Item findById(int itemId, long userId);

    @Select("SELECT * FROM Item WHERE stage_id = #{stageId} AND user_id = #{userId}")
    List<Item> findByStage(int stageId,long userId);

    @Select("SELECT * FROM Item WHERE user_id = #{userId}")
    List<Item> findAll(long userId);

    @Insert("INSERT INTO Item(stage_id,user_id,title,description,due_date) VALUES(#{stageId},#{userId},#{title}," +
            "#{description},#{dueDate})")
    @Options(useGeneratedKeys = true, keyProperty = "itemId")
    void insert(Item item);

    @Update("UPDATE Item SET stage_id=#{stageId}, title=#{title}, description=#{description}, " +
            "due_date=#{dueDate} WHERE item_id=#{itemId}")
    void update(Item item);

    @Delete("DELETE FROM Item WHERE item_id = #{itemId}")
    void delete(int itemId);
}