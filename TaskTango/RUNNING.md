# Running Instructions

This file includes instructions on how to run every piece of our code on your machine, whether it be database, backend, or frontend.

## Frontend
To run the frontend, you need to have node installed and be able to install js packages.
* To begin, navigate to the `frontend/TaskTango/` folder.
* From there, run `npm update`. This will update all the dependencies.
* After that, run `npm install`
* Finally, to run the app, run `npm run dev`.

## Backend
To run the backend, you need to have java installed and be able to run jar files.
* To begin, navigate to the `backend/TaskTango` folder.
* Running Maven
  * Then, if you are on linux or mac: `./mvnw clean package`
  * Then, if you are on windows: `./mvnw.cmd clean package`
* After that, you will have a `.jar` file created in the `backend/TaskTango/task-tango-server/target` folder.
* This jar can then be run using `java -jar task-tango-server-0.0.1-SNAPSHOT.jar` (once you are in the same folder as it.)


## Database
In order to connect to the database to manually fill in information, you need to follow the following steps:
* Connect to the Team 04 linux machine using: `ssh <username>@cs506x04.cs.wisc.edu`
* Connect to the SQL server using: `mysql -h localhost -P 53300 --protocol=TCP -u root -p`
* Enter the root password, `treeshavelotsofroots`, when prompted
* Type `use TaskTango;` to select the proper database
* Type `show tables;` to list all the tables available to you
* Insert Data into the Item Table: You can add items to those the stages using the following command:
        INSERT INTO Item (item_id, stage_id, title, description, due_date)
        VALUES
        (1, 1, 'Design Wireframes', 'Create initial wireframes for the project.',NULL),
        (2, 2, 'Develop Login Feature', 'Implement user authentication system.',NULL),
        (3, 1, 'Write Project Proposal', 'Draft the proposal for client review.',NULL);