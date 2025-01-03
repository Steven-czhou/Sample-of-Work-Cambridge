package com.cs506;
import com.cs506.context.BaseContext;
import com.cs506.controller.user.LabelController;
import com.cs506.dto.LabelRequest;
import com.cs506.dto.TaskLabelsRequest;
import com.cs506.entity.Label;
import com.cs506.exception.DataNotFoundException;
import com.cs506.exception.DeletionNotAllowedException;
import com.cs506.result.Result;
import com.cs506.vo.LabelVO;
import com.cs506.vo.TaskVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class LabelTester {

    @Autowired
    private LabelController labelController; // Autowire LabelController

    @BeforeEach
    public void labelSetup(){
        BaseContext.setCurrentId((long)1);
    }

    @Test
    void testGetLabel() {
        // Call the Controller method with ID 1
        Result<LabelVO> result = labelController.getLabel(1);

        // Check the returned result
        assertNotNull(result); // Assert that label is not null
        assertEquals(1, result.getCode());
        assertEquals(1, result.getData().getLabelId());
        assertEquals("High Priority", result.getData().getName());
        assertEquals(0, result.getData().getColor());
    }

    @Test
    void testGetLabelThrowsProperException(){
        assertThrows(DataNotFoundException.class, ()-> labelController.getLabel(-3));
    }

    @Test
    void testGetAllLabels() {
        // Call the Controller's getAllLabels method
        Result<List<LabelVO>> result = labelController.getAllLabels();

        // Verify the result is not null
        assertNotNull(result); // Assert that the result is not null
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());

        // Verify the label list is not empty if expected
        assertFalse(result.getData().isEmpty(), "The label list should contain items");

        assertEquals("High Priority", result.getData().get(0).getName());
        assertEquals(0, result.getData().get(0).getColor());
        assertEquals("Medium Priority", result.getData().get(1).getName());
        assertEquals(0, result.getData().get(1).getColor());
    }

    @Test
    void testCreateLabel() {
        // Create a LabelRequest object with sample data
        LabelRequest labelRequest = new LabelRequest();
        labelRequest.setName("New Label Name");
        labelRequest.setColor("#FF0000");

        // Call the Controller's createLabel method
        Result<LabelVO> result = labelController.createLabel(labelRequest);

        // Check the returned result
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNull(result.getData());
    }

    @Test
    void testUpdateLabels() {
        // Define the label ID and create a LabelRequest object
        int labelId = 1;
        LabelRequest labelRequest = new LabelRequest();
        labelRequest.setName("Updated Label Name");
        labelRequest.setColor("#FF0000");

        // Call the Controller's updateLabels method
        Result<LabelVO> result = labelController.updateLabels(labelId, labelRequest);

        // Check the returned result
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNull(result.getData());
    }

    @Test
    void testAddTaskLabels() {
        // Define the task ID and create a TaskLabelsRequest with sample labels
        int taskId = 1;

        Label label1 = new Label();
        label1.setLabelId(1);
        label1.setName("High Priority");
        label1.setColor("#FF0000");

        List<Label> labels = Arrays.asList(label1);
        TaskLabelsRequest taskLabelsRequest = new TaskLabelsRequest();
        taskLabelsRequest.setLabels(labels);

        // Call the Controller's addTaskLabels method
        Result<TaskVO> result = labelController.addTaskLabels(taskId, taskLabelsRequest);

        // Check the returned result
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());

        // Verify that the labels were added to the task as expected
        TaskVO taskVO = result.getData();
        List<LabelVO> labelVOList = taskVO.getLabels();
        assertEquals(2, labelVOList.size());


        assertEquals("High Priority", labelVOList.get(0).getName());
        assertEquals(0, labelVOList.get(1).getColor());
    }

    @Test
    void testRemoveTaskLabels() {
        // Define the task ID and create a TaskLabelsRequest with labels to be removed
        int taskId = 1;

        // Creates a label with a negative LabelId as it would not exist in the database
        Label label1 = new Label();
        label1.setLabelId(-2);
        label1.setName("High Priority");
        label1.setColor("#FF0000");

        List<Label> labels = Arrays.asList(label1);
        TaskLabelsRequest taskLabelsRequest = new TaskLabelsRequest();
        taskLabelsRequest.setLabels(labels);

        // Call the Controller's removeTaskLabels method
        Result<TaskVO> result = labelController.removeTaskLabels(taskId, taskLabelsRequest);

        // Check the returned result
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());

        // Verify that the labels were removed from the task
        TaskVO taskVO = result.getData();
        List<LabelVO> labelVOList = taskVO.getLabels();

        // Verify that the task no longer has the removed labels
        assertTrue(labelVOList.stream().noneMatch(label -> label.getLabelId() == label1.getLabelId()), "Label with ID " + label1.getLabelId() + " should be removed");
    }

    @Test
    void testDeleteLabelFunctionsProperly() {
        // Creates a label with a negative LabelId as it would not exist in the database
        LabelRequest testLabel = LabelRequest.builder().name("Test Label")
                .color("#FF0000").build();

        // Adds the test label
        Result<LabelVO> labelVOResult = labelController.createLabel(testLabel);

        List<LabelVO> allLabels = labelController.getAllLabels().getData();

        //Ensures the label was created properly
        assertDoesNotThrow(()->labelController.getLabel(allLabels.get(allLabels.size()-1).getLabelId()));

        // Call the Controller's deleteLabel method
        Result<LabelVO> result = labelController.deleteLabel(allLabels.get(allLabels.size()-1).getLabelId());

        // Check the returned result
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNull(result.getData());
    }

    @Test
    void testDeleteLabelThrowsExceptionIfStillUsed(){
        // Define the task ID and create a TaskLabelsRequest with sample labels
        int taskId = 1;

        Label label1 = new Label();
        label1.setLabelId(1);
        label1.setName("High Priority");
        label1.setColor("#FF0000");

        List<Label> labels = Arrays.asList(label1);
        TaskLabelsRequest taskLabelsRequest = new TaskLabelsRequest();
        taskLabelsRequest.setLabels(labels);

        // Call the Controller's addTaskLabels method
        Result<TaskVO> result = labelController.addTaskLabels(taskId, taskLabelsRequest);

        DeletionNotAllowedException exception =
                assertThrows(DeletionNotAllowedException.class,()->labelController.deleteLabel(1));
        // Ensures message is what was expected
        assertEquals("There are still tasks associated with this label",exception.getMessage());
    }

}
