package com.cs506.exception;

/**
 * Exception to be thrown when Data is not returned by a SQL statement
 */
public class DataNotFoundException extends BaseException {

    public DataNotFoundException(String msg) {
        super(msg);
    }

}
