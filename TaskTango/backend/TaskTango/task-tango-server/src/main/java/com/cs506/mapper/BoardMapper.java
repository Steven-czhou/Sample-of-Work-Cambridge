package com.cs506.mapper;

import com.cs506.entity.Board;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface BoardMapper {
    @Select("SELECT * FROM Board WHERE board_id = #{boardId} AND user_id = #{userId}")
    Board findById(int boardId, long userId);

    @Select("SELECT * FROM Board WHERE title = #{title} AND user_id = #{userId}")
    Board findByTitle(String title, long userId);

    @Select("SELECT * FROM Board WHERE user_id = #{userId}")
    List<Board> findAll(long userId);

    @Insert("INSERT INTO Board(user_id,title) VALUES(#{userId},#{title})")
    @Options(useGeneratedKeys = true, keyProperty = "boardId")
    void insert(Board board);

    @Update("UPDATE Board SET title=#{title} WHERE board_id=#{boardId}")
    void update(Board board);

    @Delete("DELETE FROM Board WHERE board_id = #{boardId}")
    void delete(int boardId);
}