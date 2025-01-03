package com.cs506;

import com.cs506.context.BaseContext;
import com.cs506.controller.user.BoardController;
import com.cs506.controller.user.StageController;
import com.cs506.controller.user.UserController;
import com.cs506.dto.*;
import com.cs506.entity.Board;
import com.cs506.exception.DataNotFoundException;
import com.cs506.result.Result;
import com.cs506.service.GetBoardService;
import com.cs506.vo.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Transactional
public class BoardTester {

    @Autowired
    private BoardController boardController;
    @Autowired
    private StageController stageController;
    @Autowired
    private GetBoardService getBoardService;
    @Autowired
    private UserController userController;

    // Variables to be setup in stageSetup
    private BoardRequest boardRequest;
    private Result<BoardVO> result;
    private BoardVO testBoard;



    @BeforeEach
    public void boardSetup(){
        BaseContext.setCurrentId((long)1);
        // Sets up a new stage and gets the list of associated tasks
        boardRequest = BoardRequest.builder()
                .title("Test Board")
                .build();
        result = boardController.createBoard(boardRequest);
        testBoard = result.getData();
    }

    @Test
    void testCreateBoardReturnsCorrect(){
        // Tests the result
        assertNotNull(result);
        assertEquals(1,result.getCode());
        assertEquals("Created Board", result.getMsg());

        // Tests the data returned to the result
        assertEquals("Test Board", testBoard.getTitle());
    }

    @Test
    void testCreateBoardNoStages(){
        List<BoardStageVO> stageList = getBoardService.getBoardStagesAndTasks(testBoard.getBoardId());

        // Tests the list to make sure no items found
        assertNotNull(stageList);
        assertEquals(0,stageList.size());
    }

    @Test
    void testGetBoardByIdGetsBoardDetails(){
        Result<GetBoardVO> getResult = boardController.getBoardByID(testBoard.getBoardId());
        GetBoardVO getBoardVO = getResult.getData();

        // Tests the result
        assertNotNull(getResult);
        assertEquals(1,getResult.getCode());
        assertEquals("Board found", getResult.getMsg());

        // Tests the data returned to the result
        assertEquals("Test Board",getBoardVO.getTitle());
    }


    @Test
    void testGetBoardByIdGetsStages(){
        // Creates a stage to put in the board
        StageRequest stageRequest = StageRequest.builder()
                .boardId(testBoard.getBoardId())
                .title("Test Stage")
                .description("Stage for Testing").build();
        stageController.createStage(stageRequest);

        // Calls the get by ID method
        Result<GetBoardVO> boardResult = boardController.getBoardByID(testBoard.getBoardId());
        List<BoardStageVO> currentBoardStages = boardResult.getData().getStages();

        // Asserts that the list returned the proper item for the stage using get service
        assertNotNull(currentBoardStages);
        assertEquals(1, currentBoardStages.size());

        // Gets the stage and asserts that it is the same as was created
        BoardStageVO retrievedStage = currentBoardStages.get(0);

        assertEquals("Test Stage",retrievedStage.getTitle());
        assertEquals("Stage for Testing",retrievedStage.getDescription());
    }

    @Test
    void testGetBoardByIdThrowsProperException(){
        assertThrows(DataNotFoundException.class, ()-> boardController.getBoardByID(-3));
    }

    @Test
    void testGetAllBoards() {
        // Call the getAllBoards method
        Result<List<GetBoardVO>> allBoardsResult = boardController.getAllBoards();

        // Check the returned result for successful retrieval of all boards
        assertNotNull(allBoardsResult);
        assertEquals(1, allBoardsResult.getCode());
        assertNotNull(allBoardsResult.getData());

        // Verify that the list of boards is not empty
        List<GetBoardVO> allBoards = allBoardsResult.getData();
        assertTrue(allBoards.size() >= 0, "The list of boards should not be empty");

        // Verify details of the final board in the list being our newly added board
        GetBoardVO finalBoard = allBoards.get(allBoards.size()-1);
        assertEquals("Test Board",finalBoard.getTitle());
    }

    @Test
    void testUpdateBoardReturnValueCorrect(){
        // Tests the data returned to the result before update
        assertEquals("Test Board",testBoard.getTitle());

        // Sets up a new update request
        BoardRequest newTitle = BoardRequest.builder()
                .title("Updated Board Title")
                .build();

        // Calls Method and processes it
        Result<Board> updatedResult = boardController.updateBoard(testBoard.getBoardId(), newTitle);
        Board updatedBoard = updatedResult.getData();

        // Tests that the update result is correct
        assertNotNull(updatedResult);
        assertEquals(1,updatedResult.getCode());
        assertEquals("Board updated successfully", updatedResult.getMsg());

        // Tests that the data returned is correct
        assertEquals(testBoard.getBoardId(),updatedBoard.getBoardId());
        assertEquals("Updated Board Title",updatedBoard.getTitle());
    }

}
