package com.cs506;

import com.cs506.context.BaseContext;
import com.cs506.controller.user.StageController;
import com.cs506.controller.user.TaskController;
import com.cs506.dto.StageBodyRequest;
import com.cs506.dto.StageRequest;
import com.cs506.dto.TaskRequest;
import com.cs506.dto.TaskStageRequest;
import com.cs506.exception.DataNotFoundException;
import com.cs506.exception.DeletionNotAllowedException;
import com.cs506.result.Result;
import com.cs506.service.GetStageService;
import com.cs506.vo.BoardTaskVO;
import com.cs506.vo.GetStageVO;
import com.cs506.vo.StageVO;

import com.cs506.vo.TaskVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class StageTester {

    @Autowired
    private StageController stageController;
    @Autowired
    private GetStageService getStageService;
    @Autowired
    private TaskController taskController;

    // Variables to be setup in stageSetup
    private StageRequest stageRequest;
    private Result<StageVO> result;
    private StageVO stageResult;

    @BeforeEach
    public void stageSetup(){
        BaseContext.setCurrentId((long)1);
        // Sets up a new stage and gets the list of associated tasks
        stageRequest = StageRequest.builder()
                .boardId(1)
                .title("Test Stage")
                .description("Stage for Testing").build();
        result = stageController.createStage(stageRequest);
        stageResult = result.getData();
    }

    @Test
    void testCreateStageReturnsCorrect(){
        // Tests the result
        assertNotNull(result);
        assertEquals(1,result.getCode());
        assertEquals("Created Stage", result.getMsg());

        // Tests the data returned to the result
        assertEquals(1, stageResult.getBoardId());
        assertEquals("Test Stage", stageResult.getTitle());
        assertEquals("Stage for Testing", stageResult.getDescription());
    }

    @Test
    void testCreateStageNoItems(){
        List<BoardTaskVO> boardTaskVOList = getStageService.getStagesAndTasks(stageResult.getStageId());

        // Tests the list to make sure no items found
        assertNotNull(boardTaskVOList);
        assertEquals(0,boardTaskVOList.size());
    }

    @Test
    void testGetStageByIdGetsStageDetails(){
        Result<GetStageVO> getResult = stageController.getStageByID(stageResult.getStageId());
        GetStageVO getStageVO = getResult.getData();

        // Tests the result
        assertNotNull(getResult);
        assertEquals(1,getResult.getCode());
        assertEquals("Stage found", getResult.getMsg());

        // Tests the data returned to the result
        assertEquals(1,getStageVO.getBoardId());
        assertEquals("Test Stage",getStageVO.getTitle());
        assertEquals("Stage for Testing", getStageVO.getDescription());
    }


    @Test
    void testGetStageByIdGetsStageItems(){
        LocalDateTime now = LocalDateTime.now().withNano(0);
        TaskRequest newTask = TaskRequest.builder()
                .title("Test Task")
                .description("Task for Testing")
                .stageId(stageResult.getStageId())
                .dueDate(now).build();
        taskController.createTask(newTask);
        Result<GetStageVO> newStage = stageController.getStageByID(stageResult.getStageId());
        List<BoardTaskVO> boardTaskVOList = newStage.getData().getItems();

        // Asserts that the list returned the proper item for the stage using get service
        assertNotNull(boardTaskVOList);
        assertEquals(1, boardTaskVOList.size());

        // Gets the task and asserts that it is the same as was created
        BoardTaskVO retrievedTask = boardTaskVOList.get(0);

        assertEquals("Test Task",retrievedTask.getTitle());
        assertEquals("Task for Testing",retrievedTask.getDescription());
        assertEquals(now,retrievedTask.getDueDate());
    }

    @Test
    void testGetStageByIdThrowsProperException(){
        assertThrows(DataNotFoundException.class, ()-> stageController.getStageByID(-3));
    }

    @Test
    void testGetAllStages() {
        // Call the getAllStages method
        Result<List<GetStageVO>> allStagesResult = stageController.getAllStages();

        // Check the returned result for successful retrieval of all stages
        assertNotNull(allStagesResult);
        assertEquals(1, allStagesResult.getCode());
        assertNotNull(allStagesResult.getData());

        // Verify that the list of stages is not empty
        List<GetStageVO> allStages = allStagesResult.getData();
        assertTrue(allStages.size() >= 0, "The list of tasks should not be empty");

        // Verify details of the final stage in the list being our newly added stage
        GetStageVO finalStage = allStages.get(allStages.size()-1);
        assertEquals("Test Stage",finalStage.getTitle());
        assertEquals("Stage for Testing",finalStage.getDescription());
        assertEquals(1,finalStage.getBoardId());
    }


    @Test
    void testUpdateStageBodyReturnValueCorrect(){
        // Tests the data returned to the result before update
        assertEquals(1,stageResult.getBoardId());
        assertEquals("Test Stage",stageResult.getTitle());
        assertEquals("Stage for Testing", stageResult.getDescription());

        // Sets up a new body
        StageBodyRequest newBody = StageBodyRequest.builder()
                .title("Updated Stage Title")
                .description("Updated Stage Description")
                .build();

        // Calls Method and processes it
        Result<StageVO> updatedResult = stageController.updateStageBody(stageResult.getStageId(), newBody);
        StageVO updatedStage = updatedResult.getData();

        // Tests that the update result is correct
        assertNotNull(updatedResult);
        assertEquals(1,updatedResult.getCode());
        assertEquals("Stage updated successfully", updatedResult.getMsg());

        // Tests that the data returned is correct
        assertEquals(stageResult.getStageId(),updatedStage.getStageId());
        assertEquals("Updated Stage Title",updatedStage.getTitle());
        assertEquals("Updated Stage Description",updatedStage.getDescription());
        assertEquals(stageResult.getBoardId(),updatedStage.getBoardId());
    }

    @Test
    void testUpdateTaskStageReturnValueCorrect(){
        LocalDateTime now = LocalDateTime.now().withNano(0);
        TaskRequest newTask = TaskRequest.builder()
                .title("Test Task")
                .description("Task for Testing")
                .stageId(stageResult.getStageId())
                .dueDate(now).build();
        taskController.createTask(newTask);

        // Sets up a second test stage
        StageRequest secondRequest = StageRequest.builder()
                .boardId(1)
                .title("Another Stage")
                .description("Another Stage for Testing").build();
        Result<StageVO> secondResult = stageController.createStage(secondRequest);
        StageVO secondStageResult = secondResult.getData();

        // Ensures that the first stage has an item in it to start
        List<BoardTaskVO> boardTaskVOList = getStageService.getStagesAndTasks(stageResult.getStageId());

        // Asserts that the list returned the proper item for the stage using get service
        assertNotNull(boardTaskVOList);
        assertEquals(1, boardTaskVOList.size());

        // Gets the task and asserts that it is the same as was created
        BoardTaskVO retrievedTask = boardTaskVOList.get(0);

        assertEquals("Test Task",retrievedTask.getTitle());
        assertEquals("Task for Testing",retrievedTask.getDescription());
        assertEquals(now,retrievedTask.getDueDate());

        // Sets up request for the method call
        TaskStageRequest taskStageRequest = TaskStageRequest.builder()
                .stageId(secondStageResult.getStageId())
                .build();

        // Calls the updateTaskStage method
        Result<TaskVO> updatedTaskResult = stageController.updateTaskStage(retrievedTask.getItemId(), taskStageRequest);
        TaskVO updatedTask = updatedTaskResult.getData();

        // Tests that the result was correct
        assertNotNull(updatedTaskResult);
        assertEquals(1,updatedTaskResult.getCode());
        assertEquals("Stage of "+retrievedTask.getItemId()+" changed successfully", updatedTaskResult.getMsg());

        // Tests that the returned data was updated properly
        assertEquals(retrievedTask.getItemId(),updatedTask.getItemId());
        assertEquals(secondStageResult.getStageId(),updatedTask.getStageId());
    }

    @Test
    void testUpdateTaskStageUpdatesStageProperly(){
        LocalDateTime now = LocalDateTime.now().withNano(0);
        TaskRequest newTask = TaskRequest.builder()
                .title("Test Task")
                .description("Task for Testing")
                .stageId(stageResult.getStageId())
                .dueDate(now).build();
        taskController.createTask(newTask);

        // Sets up a second test stage
        StageRequest secondRequest = StageRequest.builder()
                .boardId(1)
                .title("Another Stage")
                .description("Another Stage for Testing").build();
        Result<StageVO> secondResult = stageController.createStage(secondRequest);
        StageVO secondStageResult = secondResult.getData();

        // Ensures that the first stage has an item in it to start
        List<BoardTaskVO> boardTaskVOList = getStageService.getStagesAndTasks(stageResult.getStageId());

        // Asserts that the list returned the proper item for the stage using get service
        assertNotNull(boardTaskVOList);
        assertEquals(1, boardTaskVOList.size());

        // Ensures that the second stage has no items in it to start
        List<BoardTaskVO> updatedTaskList = getStageService.getStagesAndTasks(secondStageResult.getStageId());
        assertNotNull(updatedTaskList);
        assertEquals(0, updatedTaskList.size());

        // Gets the task and asserts that it is the same as was created
        BoardTaskVO retrievedTask = boardTaskVOList.get(0);

        assertEquals("Test Task",retrievedTask.getTitle());
        assertEquals("Task for Testing",retrievedTask.getDescription());
        assertEquals(now,retrievedTask.getDueDate());

        // Sets up request for the method call
        TaskStageRequest taskStageRequest = TaskStageRequest.builder()
                .stageId(secondStageResult.getStageId())
                .build();

        // Calls the updateTaskStage method
        Result<TaskVO> updatedTaskResult = stageController.updateTaskStage(retrievedTask.getItemId(), taskStageRequest);

        // Ensures that the second stage now has an item in it
        updatedTaskList = getStageService.getStagesAndTasks(secondStageResult.getStageId());

        // Asserts that the list returned the proper item for the stage using get service
        assertNotNull(updatedTaskList);
        assertEquals(1, updatedTaskList.size());

        // Gets the task and asserts that it is the same as was created
        BoardTaskVO updatedTask = updatedTaskList.get(0);

        assertEquals("Test Task",updatedTask.getTitle());
        assertEquals("Task for Testing",updatedTask.getDescription());
        assertEquals(now,updatedTask.getDueDate());

        // Re-retrieves the original stage task list to ensure its now 0
        boardTaskVOList = getStageService.getStagesAndTasks(stageResult.getStageId());
        assertNotNull(boardTaskVOList);
        assertEquals(0, boardTaskVOList.size());
    }

    @Test
    void testDeleteStageWorksWhenNoDependency() {
        // Call the deleteStage method
        Result<StageVO> deletedResult = stageController.deleteStage(stageResult.getStageId());

        // Check the returned result for successful deletion
        assertNotNull(deletedResult);
        assertEquals(1, deletedResult.getCode());
        assertNull(deletedResult.getData());
    }

    @Test
    void testDeleteStageThrowsExceptionWhenDependency() {
        LocalDateTime now = LocalDateTime.now().withNano(0);
        TaskRequest newTask = TaskRequest.builder()
                .title("Test Task")
                .description("Task for Testing")
                .stageId(stageResult.getStageId())
                .dueDate(now).build();
        taskController.createTask(newTask);

        DeletionNotAllowedException exception =
                assertThrows(DeletionNotAllowedException.class,()->stageController.deleteStage(stageResult.getStageId()));
        // Ensures message is what was expected
        assertEquals("There are still tasks in this stage",exception.getMessage());

    }






}
