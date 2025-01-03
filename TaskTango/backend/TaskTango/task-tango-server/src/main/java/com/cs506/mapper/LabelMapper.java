package com.cs506.mapper;

import com.cs506.entity.Label;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface LabelMapper {
    @Select("SELECT * FROM Label WHERE label_id = #{labelId} AND user_id = #{userId}")
    Label findById(int labelId, long userId);

    @Select("SELECT * FROM Label WHERE name = #{name} AND user_id = #{userId}")
    Label findByName(String name, long userId);

    @Select("SELECT * FROM Label WHERE user_id = #{userId}")
    List<Label> findAll(long userId);

    @Insert("INSERT INTO Label(user_id,name,color) VALUES(#{userId},#{name},#{color})")
    @Options(useGeneratedKeys = true, keyProperty = "labelId")
    void insert(Label label);

    @Update("UPDATE Label SET name=#{name},color=#{color} WHERE label_id=#{labelId}")
    void update(Label label);

    @Delete("DELETE FROM Label WHERE label_id = #{labelId}")
    void delete(int labelId);
}