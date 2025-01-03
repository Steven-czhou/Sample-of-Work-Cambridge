package com.cs506.mapper;

import com.cs506.entity.User;
import com.cs506.vo.UserVO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM User WHERE user_id = #{userId}")
    User findById(long userId);

    @Select("SELECT * FROM User WHERE username = #{username}")
    UserVO findByUsername(String username);

    @Select("SELECT * FROM User")
    List<User> findAll();

    @Insert("INSERT INTO User(username,email,phone,user_type,password) VALUES(#{username},#{email}," +
            "#{phone},#{userType},#{password})")
    @Options(useGeneratedKeys = true, keyProperty = "userId")
    void insert(User user);

    @Update("UPDATE User SET username=#{username}, email = #{email}, phone=#{phone}, " +
            "user_type=#{userType},password=#{password}, WHERE user_id=#{userId}")
    void update(User user);

    @Delete("DELETE FROM User WHERE user_id = #{userId}")
    void delete(Long userId);
}