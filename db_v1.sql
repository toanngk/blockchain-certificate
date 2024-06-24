-- Create the UniversityDB database
CREATE DATABASE IF NOT EXISTS UniversityDB;
USE UniversityDB;

-- Create the Semester table
CREATE TABLE Semester (
    SemesterID INT AUTO_INCREMENT NOT NULL,
    BlockchainID INT NULL,
    PRIMARY KEY (SemesterID)
) ENGINE=InnoDB;

-- Create the Student table
CREATE TABLE Student (
    StudentID INT AUTO_INCREMENT NOT NULL,
    FullName VARCHAR(50) NOT NULL,
    PRIMARY KEY (StudentID)
) ENGINE=InnoDB;

-- Create the StudentSemester table
CREATE TABLE StudentSemester (
    StudentID INT NOT NULL,
    SemesterID INT NOT NULL,
    PRIMARY KEY (StudentID, SemesterID),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (SemesterID) REFERENCES Semester(SemesterID)
) ENGINE=InnoDB;

-- Creating the Users table
CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    FullName VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL -- 'User' or 'Admin'
);

-- Insert Sample Users
INSERT INTO Users (Username, FullName, Password, Role)
VALUES 
('mquan', 'Quan Nguyen', 'pass1', 'Admin'),
('toantoan', 'Toan Nguyen', 'pass2', 'Admin'),
('didi', 'Vy Le', 'pass3', 'Admin'),
('vinhvinh', 'Vinh Huynh', 'pass4', 'Admin'),
('user1', 'Lars Nguyen', 'user1', 'User');

USE UniversityDB;