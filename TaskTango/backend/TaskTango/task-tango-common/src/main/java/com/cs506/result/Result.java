package com.cs506.result;

import lombok.Data;

import java.io.Serializable;

/**
 * A unified response result for the backend
 * @param <T> the type of data being returned
 */
@Data
public class Result<T> implements Serializable {

    private Integer code; // Code: 1 for success, 0 or other numbers for failure
    private String msg;   // Personal Success/Error message
    private T data;       // Data

    // Method to return a success result without data
    public static <T> Result<T> success() {
        Result<T> result = new Result<>();
        result.code = 1;
        return result;
    }

    // Method to return a success result with data
    public static <T> Result<T> success(T object) {
        Result<T> result = new Result<>();
        result.data = object;
        result.code = 1;
        return result;
    }

    // Method to return a success result without data
    public static <T> Result<T> success(T object, String msg) {
        Result<T> result = new Result<>();
        result.data = object;
        result.code = 1;
        result.msg = msg;
        return result;
    }

    // Method to return an error result with a message
    public static <T> Result<T> error(String msg) {
        Result<T> result = new Result<>();
        result.msg = msg;
        result.code = 0;
        return result;
    }
}
