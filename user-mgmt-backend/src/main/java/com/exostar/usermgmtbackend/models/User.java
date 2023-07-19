package com.exostar.usermgmtbackend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Pattern;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvBindByPosition;
import com.opencsv.bean.CsvDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    @Pattern(regexp = "^.{0,50}$", message = "First Name cannot exceed 50 characters")
    @CsvBindByName(column = "firstName")
    @CsvBindByPosition(position = 1)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    @Pattern(regexp = "^.{0,50}$", message = "Last Name cannot exceed 50 characters")
    @CsvBindByName(column = "lastName")
    @CsvBindByPosition(position = 2)
    private String lastName;

    @Column(name = "address", nullable = false, length = 100)
    @Pattern(regexp = "^.{0,100}$", message = "Address cannot exceed 100 characters")
    @CsvBindByName(column = "address")
    @CsvBindByPosition(position = 3)
    private String address;

    @Column(name = "city", nullable = false, length = 50)
    @Pattern(regexp = "^.{0,50}$", message = "City cannot exceed 50 characters")
    @CsvBindByName(column = "city")
    @CsvBindByPosition(position = 4)
    private String city;

    @Column(name = "state", nullable = false, length = 2)
    @CsvBindByName(column = "state")
    @CsvBindByPosition(position = 5)
    @Pattern(regexp = "^[A-Z]{2}$", message = "Invalid state abbreviation. State must be in the form of XX")
    private String state;

    @Column(name = "zip_code", nullable = false, length = 10)
    @Pattern(regexp = "^\\d{5}$", message = "Invalid zip code. Zip code must be in the form of 99999")
    @CsvBindByName(column = "zipCode")
    @CsvBindByPosition(position = 6)
    private String zipCode;

    @Column(name = "phone", nullable = true, length = 20)
    @Pattern(regexp = "$|^(\\+\\d{1,2}\\s?)?(\\()?(\\d{3})(\\))?[-\\s]?(\\d{3})[-\\s]?(\\d{4})$", message = "Invalid phone number. Phone number must be in 999-999-9999 or (999) 999-9999 format.")
    @CsvBindByName(column = "phone")
    @CsvBindByPosition(position = 7)
    private String phone;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", message = "Invalid email address")
    @CsvBindByName(column = "email")
    @CsvBindByPosition(position = 8)
    private String email;

    @Column(name = "dob", nullable = false)
    @DateTimeFormat(pattern="mm/dd/yyyy")
    @CsvBindByName(column = "dob")
    @CsvBindByPosition(position = 9)
    @CsvDate(value = "mm/dd/yyyy")
    private Date dob;

    @Column(name = "ssn", unique = true, nullable = false, length = 100)
    @Pattern(regexp = "^\\d{3}-\\d{2}-\\d{4}$", message = "Invalid social security number. Expected 999-99-9999 format")
    @CsvBindByName(column = "ssn")
    @CsvBindByPosition(position = 10)
    private String ssn;

    @Column(name = "picture", nullable = true, length = 2048)
    @Pattern(regexp = "^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$", message = "Invalid picture URL")
    @CsvBindByName(column = "picture")
    @CsvBindByPosition(position = 11)
    private String picture;
}
