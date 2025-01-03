# Database Commands

This file contains all the SQL commands needed to recreate the database tables from scratch if need be.
This was only made due to our database somehow getting wiped.

## Commands

Tables
```
CREATE TABLE `TaskTango`.`User` (
  `user_id` bigint NOT NULL auto_increment,
  `username` TEXT NOT NULL,
  `email` TEXT NOT NULL,
  `phone` TEXT NOT NULL,
  `user_type` TEXT NOT NULL,
  `password` TEXT NOT NULL,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `TaskTango`.`Item` (
  `item_id` INT NOT NULL auto_increment,
  `stage_id` INT NOT NULL,
  `user_id` bigint NOT NULL,
  `title` TEXT NOT NULL,
  `description` TEXT,
  `due_date` DATETIME,
  PRIMARY KEY (`item_id`)
);

CREATE TABLE `TaskTango`.`LabelList` (
  `labellist_id` INT NOT NULL auto_increment,
  `label_id` INT NOT NULL,
  `item_id` INT NOT NULL,
  PRIMARY KEY (`labellist_id`)
);

CREATE TABLE `TaskTango`.`Label` (
  `label_id` INT NOT NULL auto_increment,
  `user_id` bigint NOT NULL,
  `name` TEXT NOT NULL,
  `color` TEXT NULL,
  PRIMARY KEY (`label_id`)
);

CREATE TABLE `TaskTango`.`Stage` (
  `stage_id` INT NOT NULL auto_increment,
  `board_id` INT NOT NULL,
  `user_id` bigint NOT NULL,
  `title` TEXT NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`stage_id`)
);

CREATE TABLE `TaskTango`.`Board` (
  `board_id` INT NOT NULL auto_increment,
  `user_id` bigint NOT NULL,
  `title` TEXT NOT NULL,
  PRIMARY KEY (`board_id`)
);
```

Foreign Keys
```
alter table `TaskTango`.`LabelList` add constraint `labellist_fk_label_id` foreign key (label_id) references Label(label_id);
alter table `TaskTango`.`LabelList` add constraint `labellist_fk_item_id` foreign key (item_id) references Item(item_id);
alter table `TaskTango`.`Stage` add constraint `stage_fk_board_id` foreign key (board_id) references Board(board_id);
alter table `TaskTango`.`Board` add constraint `board_fk_user_id` foreign key (user_id) references User(user_id);
alter table `TaskTango`.`Item` add constraint `item_fk_user_id` foreign key (user_id) references User(user_id);
alter table `TaskTango`.`Label` add constraint `label_fk_user_id` foreign key (user_id) references User(user_id);
alter table `TaskTango`.`Stage` add constraint `stage_fk_user_id` foreign key (user_id) references User(user_id);
```

Unique Keys

```
alter table `TaskTango`.`User` add UNIQUE (email(100));
alter table `TaskTango`.`User` add UNIQUE (username(100));
```
- Note: The (100) portion indicates how much of the text indexed to make the unique key. I chose 100 as an arbitrarily large number.

List all tables
```
describe User; describe Item; describe LabelList; describe Label; describe Stage; describe Board;
```

Insert demo data
```
insert into User (user_id,username,email,phone,user_type,password) values (1,"nspaid","nspaid@wisc.edu","911","admin","password1234");
insert into Board (board_id,title) values (1,"Demo Board");
insert into Stage (stage_id,board_id,title,description) values (1,1,"To-Do","Tasks that still need to be done");
insert into Stage (stage_id,board_id,title,description) values (2,1,"In Progress","Tasks in progress still");
insert into Stage (stage_id,board_id,title,description) values (3,1,"Done","Completed tasks");
insert into Label (label_id,name,color) values (1,"High Priority","#FF0000");
insert into Label (label_id,name,color) values (2,"Medium Priority","#FFFF00");
insert into Label (label_id,name,color) values (3,"Low Priority","#0000FF");
insert into Item (item_id,stage_id,title,description,due_date) values (1,1,"Design Wireframes","Create initial wireframes for the project.",NULL);
insert into Item (item_id,stage_id,title,description,due_date) values (2,2,"Develop Login Feature","Implement user authentication system.",NULL);
insert into Item (item_id,stage_id,title,description,due_date) values (3,1,"Write Project Proposal","Draft the proposal for client review.",NULL);
insert into Item (item_id,stage_id,title,description,due_date) values (4,3,"Test Payment Gateway","Perform end-to-end testing on payment module.",NULL);
insert into Item (item_id,stage_id,title,description) values (5,2,"Set up Database","Initialize MySQL database and configure tables.",NULL);
insert into LabelList (labellist_id,item_id,label_id) values (1,1,1);
insert into LabelList (labellist_id,item_id,label_id) values (2,2,2);
insert into LabelList (labellist_id,item_id,label_id) values (3,3,3);
insert into LabelList (labellist_id,item_id,label_id) values (4,4,3);
insert into LabelList (labellist_id,item_id,label_id) values (5,5,2);
```