"""
This script creates the user_mgmt_portal_db database and backend user.
it will drop them first if they already exist. 
"""
import mysql.connector, os

rds_endpoint            = os.environ['PORTFOLIO_RDS_ENDPOINT']
rds_root_username       = os.environ['PORTFOLIO_RDS_ROOT_USERNAME']
rds_root_password       = os.environ['PORTFOLIO_RDS_ROOT_PASSWORD']
rds_backend_username    = os.environ['PORTFOLIO_RDS_BACKEND_USERNAME']
rds_backend_password    = os.environ['PORTFOLIO_RDS_BACKEND_PASSWORD']

# Recreate the user_mgmt_portal_db and user
sql = f'''
-- Drop the database if it exists
DROP DATABASE IF EXISTS user_mgmt_portal_db;
DROP USER IF EXISTS '{rds_backend_username}'@'%';

-- Create the database
CREATE DATABASE user_mgmt_portal_db;

-- Create user
CREATE USER '{rds_backend_username}'@'%' IDENTIFIED BY '${rds_backend_password}';
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO '{rds_backend_username}'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
'''

try:


    # Connect to MySQL server
    conn = mysql.connector.connect(host=rds_endpoint, user=rds_root_username, passwd=rds_root_password)
    print("Connected to MySQL server")

    # Execute SQL script
    cursor = conn.cursor()
    cursor.execute(sql)
    print("Database and table creation completed successfully!")

except mysql.connector.Error as error:
    print("Error executing SQL script: {}".format(error))

except Exception as error:
    print("Unhandled exception: {}".format(error))

finally:
    # Close cursor and connection
    if cursor:
        cursor.close()
    if conn and conn.is_connected():
        conn.close()
        print("MySQL connection is closed.")

