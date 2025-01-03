package com.cs506.handler;

import com.cs506.constant.MessageConstant;
import com.cs506.exception.BaseException;
import com.cs506.exception.DataNotFoundException;
import com.cs506.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import java.sql.SQLIntegrityConstraintViolationException;


/**
 * Global exception handler to handle business exceptions thrown in the project
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler
    public Result exceptionHandler(BaseException ex) {
        log.error("Error/Exception message：{}", ex.getMessage());
        return Result.error(ex.getMessage());
    }

    @ExceptionHandler
    public Result duplicateExceptionHandler(SQLIntegrityConstraintViolationException ex) {
        String message = ex.getMessage();
        if (message != null && message.contains("Duplicate entry")) {
            String[] split = message.split(" ");
            String username = split[2];
            String msg = username + MessageConstant.ALREADY_EXISTS;
            return Result.error(msg);
        } else if (message != null && message.contains("Cannot delete or update a parent row: a foreign key constraint fails")) {
            return Result.error("There is something associated with this user, you can't delete it.");
        } else {
            return Result.error(MessageConstant.UNKNOWN_ERROR);
        }
    }


}
