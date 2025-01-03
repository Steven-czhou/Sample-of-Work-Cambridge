package com.cs506;

import com.cs506.context.BaseContext;
import com.cs506.controller.user.BoardController;
import com.cs506.controller.user.UserController;
import com.cs506.dto.BoardRequest;
import com.cs506.dto.LoginRequest;
import com.cs506.dto.RegisterRequest;
import com.cs506.exception.AccountNotFoundException;
import com.cs506.exception.DataNotFoundException;
import com.cs506.exception.PasswordErrorException;
import com.cs506.properties.JwtProperties;
import com.cs506.result.Result;
import com.cs506.vo.BoardVO;
import com.cs506.vo.GetBoardVO;
import com.cs506.vo.UserLoginVO;
import com.cs506.vo.UserVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserTester {

    @Autowired
    private UserController userController;

    @Autowired
    private BoardController boardController;

    @Autowired
    private JwtProperties jwtProperties;

    @Test
    void testLoginThrowsExceptionWhenUserNotFound() {
        // Create a valid LoginRequest object
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("userNotInDatabase");
        loginRequest.setPassword("password1234");

        // Call the Controller's loginUser method, checks to make sure proper exception is thrown
        AccountNotFoundException exception =
                assertThrows(AccountNotFoundException.class,()->userController.loginUser(loginRequest));
        // Ensures message is what was expected
        assertEquals("Account Not Found",exception.getMessage());
    }

    @Test
    void testLoginThrowsExceptionWhenPasswordIncorrect() {
        // Create a valid LoginRequest object
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("nspaid");
        loginRequest.setPassword("incorrect");

        // Call the Controller's loginUser method, checks to make sure proper exception is thrown
        PasswordErrorException exception =
                assertThrows(PasswordErrorException.class,()->userController.loginUser(loginRequest));
        // Ensures message is what was expected
        assertEquals("Wrong Password",exception.getMessage());
    }


    @Test
    void testLoginUserWithValidCredentials() {
        // Create a valid LoginRequest object
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("nspaid");
        loginRequest.setPassword("password1234");

        // Call the Controller's loginUser method
        Result<UserLoginVO> result = userController.loginUser(loginRequest);

        // Check the returned result for successful login
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());
        assertNotNull(result.getData().getToken());
        assertEquals(1, result.getData().getId());
    }

    @Test
    void testRegisterUserWithValidData() {
        // Create a valid RegisterRequest object
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("newUser");
        registerRequest.setPassword("123456");
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPhone("1234567890");
        registerRequest.setUserType("regular");

        // Call the Controller's registerUser method
        Result<UserVO> result = userController.registerUser(registerRequest);

        // Check the returned result for successful registration
        assertNotNull(result);
        assertEquals(1, result.getCode());
        assertNotNull(result.getData());
        assertEquals("newUser", result.getData().getUsername());
        assertEquals("123456", result.getData().getPassword());
        assertEquals("newuser@example.com", result.getData().getEmail());
        assertEquals("1234567890", result.getData().getPhone());
        assertEquals("regular", result.getData().getUserType());
    }

    @Test
    void testUserOnlyAbleToViewCertainItems(){
        BaseContext.setCurrentId((long)-1);
        // Sets up a new stage and gets the list of associated tasks
        BoardRequest boardRequest = BoardRequest.builder()
                .title("Test Board")
                .build();
        Result<BoardVO> createResult = boardController.createBoard(boardRequest);
        BoardVO createdBoard = createResult.getData();

        // Ensures that this board can be found while Base Context is -1
        Result<GetBoardVO> getResult = boardController.getBoardByID(createdBoard.getBoardId());
        assertNotNull(getResult);
        assertEquals(1,getResult.getCode());
        assertEquals("Board found", getResult.getMsg());

        // Changes the BaseContext to -3
        BaseContext.setCurrentId((long)-3);

        // Ensures that the board found above is now no longer visible
        DataNotFoundException ex = assertThrows(DataNotFoundException.class, ()-> boardController.getBoardByID(createdBoard.getBoardId()));
        assertEquals("No board found", ex.getMessage());

    }

}
