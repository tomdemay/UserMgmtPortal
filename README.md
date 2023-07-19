
<img src="https://exostar.b-cdn.net/inc/uploads/2023/02/exostar-logo.svg" alt="Exostar">

### **TLDR**: I do not expect this to be read. I expect to speak to it when we meet to discuss the project. I provided this brain dump so you can get an idea of my thought process and the kind of person you can expect from my work ethic. 
Please forgive the content of this document. It's purpose is to provide you with a brain dump. I did not spend a lot of time on it making it "production" ready! ;)


# Code Assessment
## Requirements
Create a single page application that will upload a CSV file containing a list of users to a database.

* Create a front end server
  * Must be implemented with Angular Materials
  * Must be a single page application
  * User uploads a CSV file containing a list of users
  * Front end makes a REST API call to send the file
  * Appropriately communicate results to the user
  * User must be able to fix any violation errors in the file and reattempt to upload
* Create a back end server
  * Back end must be a Spring Boot REST API
  * The backend must validate the CSV file before importing the data
* Must include the standard stuff delivered with any completed project
    * Log files
    * Code Comments
    * Markdown documentation
    * Setup instructions/scripts
* Robust error handling
* Documentation (this file), including any design patterns used. 
* Be prepared to discuss my process

## Setup
Once download from GIT you will need to configure access to RDMS system of your choice. MySQL was used for testing. 
* setup directory 
  * create-db.py python script to create the database. Update the connection information as needed. No DDL is required that is all handled by the backend service. 
  * create-test-data. This script was used to download user data from randomuser.me. Just provide the output location, the number of unique users you require and a pause interval between batches (5,000) to be respectful of their server. 
* VS Code was used for development, debugging and testing. Open the parent directory in VS Code to get the debug configuration. There's a known issue with back end server, you just had to select your start up module. 
  
## Notable Files
* The aforementioned python scripts will help get you started
* Test data includes valid and invalid data sets, small and large. The real large ones are not checked into Git due to file size limitations. But I have them available if needed. 
* user-mgmt-backend: Mavon POM file is used for dependency management and build process
  * configurations and converters: Spring beans are used to setup some configuration, to allow REST APIs to return identifiers and address some CORS related issues I needed to work around for adequate error handle (CORS security measures are essentially disabled for this demonstration) and converting all empty strings to Null values as they are stored in the database. 
  * controllers: A very lightweight controller is used to handle CSV file uploads. It uses opencsv to handle processing. Relatively no parsing code is needed. opencsv uses the entity annotations to successfully parse the file and hands off the data to JPA to upload into the database. These tools are very fast. I saw rates as high was 1500 records per second being parsed and uploaded to the database. 
  * exceptions: A global exception handler and a error response interface are implemented to catch all errors and communicate as much information as possible back to the user. When something is wrong with a records, all validations are performed and all data is displayed to the user. But only one record at a time to maximize performance and readability. 
  * models: Perhaps 90% of everything the Spring needs to host a REST API is laid out in this relatively small interface. Everything is handled (database creation, validation, REST APIs, DDL) through field and class annotations. No code is needed. 
  * repository. Just creating a subclass of the JpaRespositoy is all that is needed (along with a interface to describe users) to create a fully functional REST Application
  * responses/UserResponse and exceptions/UserResponseException are two classes used to provide an object model and implementation for ALL user responses, successes and failures. Callers can rely on the same interface for all errors and responses. 
* user-mgmt-frontend: The front end angular materials application
  * entities: All interfaces required are provided here. All dictionaries used by this application has a corresponding interface to support it. 
  * material: This was an attempt to isolate all Angular Materials in one location. I ran into some problems with it so it's use and the main app.module is not consistent. I had difficulty implementing the stand alone components so I went with these files. 
  * services. This is where all the meat of the application is. All the processing is done here. All the components just wrap APIs around the exposed CRUD (and CSV upload) APIs and subscribes to observables and events to communicate throughout the system. When reviewing this keep in mind that if I had more time I would refactor this to have the service maintain the list of users displayed in the user list component, opposed to the user list component. This makes it easier for other components to subscribe to events. 
  * users/upload-csv. component that handles uploading the CSV, communicating status and progress events and allows users to cancel long running uploads. This really is not a true cancel. This basically just unsubscribes the user, but it doesn't work well. More work would be needed here.
  * users/user. This would be the component that handled editing and adding new users if I had more time. 
  * users/user-list. The component that handles the user list. 
  * 
### Limits and Performance
The following are the requirements on limits and performance
* Max file limit could be about 5MB
* Must be able to parse and least 5 records per second at a minimum. 

### Non-Requirements
There are no requirements imposed on the following:
* Can use any database I choose, although RDBMS would be preferred. In memory database is okay too. 
* Data set. There are no requirements on what data to capture, but it should include standard things that would typically need to be evaluated, such as phone numbers, emails, social security numbers, some date information (date of hire, date of birth, etc).
* No requirements on whether transactions are synchronous or asynchronous. But if it's asynchronous there probably should be a mechanism to query state information. 
* Validating MIME-types
* Managed services is not a requirement, but would be nice to have.

## Nice to haves
The following is a list of ideas that would be taken into consideration if this was a real world project. 

### Additional Features
* Idempotent. Although one could say the email address could be considered an idempotent token. 
* Drag and Drop files
* NgRx for state management
* Able to query state
* Queryable Audit Trail
* Uploading profile images
* Address verification
* Message broker if it made sense to implement one
* Asynchronous transactions (with ability to query state information)
* Identity and User Management
* CRUD and Pagination
* Password Hashing
* CDN for images and any static data or use something like Amazon S3
* Auto Scaling and Load Balancing
* Cancel Interceptor (canceling upload doesn't just unsubscribes, it tells the server to stop)
* Unit Test
* Alerting/Metrics
* Nice user interface with animation (spinner, progress bar)


## Implementation
Overall implementation: (items in bold were on the nice to have list or thrown in)
* MySQL for the back end database. 
* Spring Boot REST API and Angular Materials for backend and frontend
* **Backend supports full CRUD operations** in addition to a CSV file upload controller.
  * Standard CRUD APIs are supported from the /api/users base URL. In addition "upload-csv" from the base URL is routed to handle CSV file uploads.
* NgRx was not implemented
* Only list view is provided at this time. Wiring up the UI was not completed for the other CRUD operations. 
* **Displaying paginated view of the data and profile images**. I gave the user the ability to display 1000 records at a time in order to test performance. But I would never permit this in production. 
* Single Page user experience
* User images are provided in the test data. URLs are stored in the database for simplicity opposed to storing images on disk or in a Data URI format
* all data is validated on both the front end and again on the back end using regular expressions. US state abbreviations are validated on the front end, but not the back end. 
* **MIME types are validated on the back end.**, they should be validated on the front end as well.
* CSV supports headers and no headers. (although no testing was done without headers)
* Relies on Spring REST, JPA and Hibernate to handle pre-flight requests. (tests showed they were not reliable). Would require additional work if this was for production. 
* Upload CSV file supports a **progress bar when uploading** (not for back end processing) and the **ability to cancel** the upload is implemented.
* **Supports file sizes of 250MB** (5MB was the ask). This was necessary to test performance, reliability and user experience. In production this would be limited to 5MB.
* The backend service logs all trace and debug messages to a log file in it's root directory and displays all info error messages and higher to the console. This is an essential requirement for services hosted in a containerized service to expose log messages to outside the container. 
* The front end logs to the console as most debugging is done there. No log files are creates. That can be handled by the web browser if needed, or streaming stdout/stderr if necessary. 

  
  
### Performance and Known issues
* Transactions with the REST server use the Observer/Subscribe design pattern to request the data and then subscribe to the results and progress information without blocking the user experience. 
* **Can handle multiple files being uploaded simultaneously** by the same user.
* Parses the CSV file and address all the records to the database on average of **1,000 - 1,500 records per second**. (5 records per second was the ask). Tested with 100,000 user records. Disclaimer: Everything was done on my local host. No metrics were captured when deployed to production servers.
* The implementation is designed for demonstration purposes only as it's a single back end and front end servers not designed for load balancing, scaling or fault tolerance. 
* This solution is not intended to be a production ready solution. It's a demonstration of my skills and abilities. There are many things that would need to be done to make this a production ready solution. See the section below on things to consider for production applications.
* There are many bugs and quality improvements that need to be done, for example, canceling up load isn't reliable, backend preflight is not reliable as I was able to upload a 4GB ISO image during my destructive testing, canceling backend processing and detailed error messages from the back end to the front end are not consistent. The are sent, but angular is unable to read them. 
* CORS policies had to be relaxed to work around some issues I was facing. 

## Things to consider for production applications
* Drag and Drop upload support
* Better validation of CSV files on the front end before uploading. 
* Perhaps reconsider the use of JPA repository to provide better control. JPA provides a lot of helpful features, but limits flexibility. One line of code is all that's needed to create a REST API repository. 
* Fault tolerant data store for static files and images. Perhaps a CDN to replicate static artifacts to various regions to reduce latency times. 
* A managed service, such as Azure Databases or AWS RDS would offer the following benefits:
  * Easy Database Setup and Management
  * Automated Backups and Recovery
  * High availability and fault tolerance
  * Scalability
  * Automated software patching
  * security features
  * monitoring and metrics
  * multiple region deployments
  * pay-as-you-go pricing
  * support for a variety of database engines. 
* Managed Iaas could be used to create horizontally scalable, and load balancing. Either through hosted machines or through a container orchestration platform using a docker repository like Docker Hub, GitHub, Azure Container Registry or Amazon Elastic Container Repository (ECR) and a orchestration platform such as Kubernetes available on either Azure Kubernetes Service (AKS) or Amazon Elastic Container Server (ECS). Benefits: 
  * automated deployment and scaling. 
  * rapid deployment and scaling.
  * high availability and fault tolerance, self healing and auto recovery
  * load balancing
  * rolling updates and rollbacks
  * storage management
  * more efficient resource utilization
  * heterogeneous environment support
  * cloud agnostic
  * eliminates overhead of managing all these services in house.
* Use managed services, either for Iaas or Paas would benefit Exostar in the following ways: 
  * cost savings and predictable costs
  * expertise and support
  * allows ExoStar to focus on core-business
  * scalability and flexibility
  * improved security
  * continuous monitoring and maintenance
  * up-to-date technology
  * rapid deployment
  * disaster recovery  

## Not provided that normally would be part of the design process.
* Requirements documentation
* Design documentation
* Architecture Model
* Threading Model
* Object Model
* Security Threat Model
* Test Plans
* Unit and Integration Tests and Test plans
* Performance Testing

## Design patterns used 
* **Observer/Subscription**: Observer and Subscription is a core part of the Angular implementation. Components share data through series of events and subscribing to data streams to communicate. For example, the toolbar component lets the user list component know it's time to refresh after downloading by posting an event in a shared service that the user list subscribes to. The progress bar subscribes to ALL http traffic and handles displaying progress information and messages to the user. 
* **Dependency Inversion Principle (DIP)**: This is one of the 5 tenets of object-oriented programming and design known as SOLID. My first exposure to OOP and DIP was what got me really excited about the career path I was taking. This principal states that higher level modules should not depend on lower level modules. In practice, this is initially implemented through base and super classes and more and more so in the the past few decades on interfaces and templates. Angular uses DIP to define methods that classes must suppose, such as OnInit, OnDestroy, OnChange. 
* **Dependency Injection**: Spring Boot is heavily rooted on dependency injection. Dependency injection further decouples dependencies between the various components in a system. Dependencies are "injected" into them, rather than creating the dependencies themselves. Spring boot makes use of this through class and function annotation. 
* **Decorator Pattern**: The decorator pattern is strongly suggested to ease development of a Spring application, but is not required. In the example provided, the whole back end data model, validation rules, CRUD support and DDL is provided through annotations. A user interface was built in Java and annotated with the CSV column bindings, RegEx pattern validation, required fields, length of fields, their data types. Everything anything needs to know about what is supported by the interface is heavily decorated. These decorators allow JPA to create the required database tables and strongly binds the interface to the User table. All that's needed is create a database, a user to use it and build a connection string to point the application to it and JPA will use the decorator pattern to read the annotations and build the table with all the constraints and indexes needed. All logging support was provided by use of a simple @Slf4j annotation from lombok. 
* 