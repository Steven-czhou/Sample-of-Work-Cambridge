package com.cs506;
import com.cs506.context.BaseContext;
import com.cs506.controller.user.TaskController;
import com.cs506.dto.TaskBodyRequest;
import com.cs506.dto.TaskRequest;
import com.cs506.entity.Label;
import com.cs506.exception.DataNotFoundException;
import com.cs506.result.Result;
import com.cs506.vo.ItemVO;
import com.cs506.vo.LabelVO;
import com.cs506.vo.TaskVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class TaskTester {

    @Autowired
    private TaskController taskController;

    @BeforeEach
    public void taskSetup(){
        BaseContext.setCurrentId((long)1);
    }

    @Test
    void testGetTaskWithValidTaskId() {
        // Define a valid task ID
        int taskId = 1; // Assuming this task ID exists in the test database

        // Call the Controller's getTask method
        Result<TaskVO> result = taskController.getTask(taskId);

        // Check the returned result for successful task retrieval
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());

        // Verify the task data
        TaskVO taskVO = result.getData();
        assertEquals(taskId, taskVO.getItemId());
        assertNotNull(taskVO.getLabels());

        // Verify label details if known
        List<LabelVO> labels = taskVO.getLabels();
        assertTrue(labels.size() > 0, "The task should have associated labels");
    }

    @Test
    void testGetTaskThrowsProperException(){
        assertThrows(DataNotFoundException.class, ()-> taskController.getTask(-3));
    }

    @Test
    void testGetAllTasks() {
        // Call the Controller's getAllTasks method
        Result<List<TaskVO>> result = taskController.getAllTasks();

        // Check the returned result for successful retrieval of all tasks
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());

        // Verify that the list of tasks is not empty
        List<TaskVO> taskVOList = result.getData();
        assertTrue(taskVOList.size() > 0, "The list of tasks should not be empty");

        // Verify details of the first task in the list if known
        TaskVO firstTask = taskVOList.get(0);
        assertEquals(1, firstTask.getItemId());
        assertNotNull(firstTask.getLabels(), "The first task should have a list of labels");
    }

    @Test
    void testCreateTask() {
        // Define the task details and labels to be associated
        TaskRequest taskRequest = new TaskRequest();
        taskRequest.setStageId(2);
        taskRequest.setTitle("New Task Title");
        taskRequest.setDescription("New Task Description");
        taskRequest.setDueDate(LocalDateTime.of(2024, 12, 31, 23, 59));

        // Create labels for the task
        Label label1 = new Label();
        label1.setLabelId(1); // Assuming label ID 1 may already exist
        label1.setName("Urgent");

        Label label2 = new Label();
        label2.setLabelId(2); // Assuming label ID 2 may already exist
        label2.setName("High Priority");

        // Set labels in the task request
        taskRequest.setLabels(Arrays.asList(label1, label2));

        // Call the Controller's createTask method
        Result<ItemVO> result = taskController.createTask(taskRequest);

        // Check the returned result for successful creation
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());

        // Verify that the task data reflects the created details
        ItemVO createdTask = result.getData();
        assertNotNull(createdTask.getItemId(), "The created task should have an item ID");
    }

    @Test
    void testUpdateTaskBody() {
        // Define the task ID and create a TaskBodyRequest with updated details
        int taskId = 1; // Assuming this task ID exists in the test database

        TaskBodyRequest taskBodyRequest = new TaskBodyRequest();
        taskBodyRequest.setTitle("Updated Task Title");
        taskBodyRequest.setDescription("Updated Task Description");
        taskBodyRequest.setDueDate(LocalDateTime.of(2024, 12, 31, 23, 59)); // Example date and time


        // Call the Controller's updateTaskBody method
        Result<TaskVO> result = taskController.updateTaskBody(taskId, taskBodyRequest);

        // Check the returned result for successful task update
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());

        // Verify that the task data reflects the updated details
        TaskVO updatedTask = result.getData();
        assertEquals(taskId, updatedTask.getItemId());
        assertEquals("Updated Task Title", updatedTask.getTitle());
        assertEquals("Updated Task Description", updatedTask.getDescription());
        assertEquals(LocalDateTime.of(2024, 12, 31, 23, 59), updatedTask.getDueDate());

        // Verify that the labels are still associated with the task
        assertNotNull(updatedTask.getLabels());
        assertTrue(updatedTask.getLabels().size() > 0, "The task should have associated labels");
    }

    // TODO: skip this for now (have two similar methods in two different controllers)
    @Test
    void testAddLabelsToTask() {

    }

    // TODO: skip this for now (have two similar methods in two different controllers)
    @Test
    void testRemoveTaskLabels() {

    }

    @Test
    void testDeleteTask() {
        // Define the task ID to be deleted
        int taskId = 1; // Assuming this task ID exists in the test database and has associated labels

        // Call the Controller's deleteTask method
        Result<TaskVO> result = taskController.deleteTask(taskId);

        // Check the returned result for successful deletion
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNull(result.getData());
    }
}
