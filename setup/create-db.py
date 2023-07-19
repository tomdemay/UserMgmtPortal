"""
This script creates the exostar database and admin user.
it will drop them first if they already exist. 
"""
import mysql.connector, os

# Recreate the exostar database and admin user
sql = '''
-- Drop the database if it exists
DROP DATABASE IF EXISTS exostar;
DROP USER IF EXISTS 'admin'@'localhost';

-- Create the database
CREATE DATABASE exostar;

-- Create admin/password user
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
'''


try:
    # Connect to MySQL server
    conn = mysql.connector.connect(host="localhost", user="root", passwd="password")
    print("Connected to MySQL server")

    # Execute SQL script
    cursor = conn.cursor()
    cursor.execute(sql)
    print("Database and table creation completed successfully!")

except mysql.connector.Error as error:
    print("Error executing SQL script: {}".format(error))

finally:
    # Close cursor and connection
    if cursor:
        cursor.close()
    if conn and conn.is_connected():
        conn.close()
        print("MySQL connection is closed.")

