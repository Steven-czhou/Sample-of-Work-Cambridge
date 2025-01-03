package com.cs506.mapper;

import com.cs506.entity.Stage;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface StageMapper {
    @Select("SELECT * FROM Stage WHERE stage_id = #{stageId} AND user_id = #{userId}")
    Stage findById(int stageId, long userId);

    @Select("SELECT * FROM Stage WHERE board_id = #{boardId} AND user_id = #{userId}")
    List<Stage> findByBoard(int boardId, long userId);

    @Select("SELECT * FROM Stage WHERE board_id = #{boardId} AND title = #{title} AND user_id = #{userId}")
    Stage findByBoardAndTitle(int boardId, String title, long userId);

    @Select("SELECT * FROM Stage WHERE user_id = #{userId}")
    List<Stage> findAll(long userId);

    @Insert("INSERT INTO Stage(board_id,user_id,title,description) VALUES(#{boardId},#{userId},#{title}," +
            "#{description})")
    @Options(useGeneratedKeys = true, keyProperty = "stageId")
    void insert(Stage stage);

    @Update("UPDATE Stage SET board_id=#{boardId}, title=#{title}, description=#{description} " +
            "WHERE stage_id=#{stageId}")
    void update(Stage stage);

    @Delete("DELETE FROM Stage WHERE stage_id = #{stageId}")
    void delete(int stageId);
}