package com.cs506.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Board {

    private int boardId; // Board ID
    private long userId; // User ID
    private String title; // Board title

}
