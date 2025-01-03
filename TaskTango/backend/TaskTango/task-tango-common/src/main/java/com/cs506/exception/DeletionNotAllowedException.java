package com.cs506.exception;

/**
 * Deletion is not allowed because there are existing associations.
 */
public class DeletionNotAllowedException extends BaseException {

    public DeletionNotAllowedException(String msg) {
        super(msg);
    }

}
