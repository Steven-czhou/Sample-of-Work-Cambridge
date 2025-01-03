package com.cs506.exception;

/**
 * base exception that can be expanded by other custom exception
 */
public class BaseException extends RuntimeException {

    public BaseException() {
    }

    public BaseException(String msg) {
        super(msg);
    }

}
