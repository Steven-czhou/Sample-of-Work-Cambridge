package com.cs506.dto;

import com.cs506.entity.Label;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskLabelsRequest {
    List<Label> labels;
}
