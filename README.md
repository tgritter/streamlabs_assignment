# STREAMLABS demo/assignment

https://streamlabsprojectravis.herokuapp.com/

## DEPENDENCIES

Ruby on Rails, ReactJS

## INFO
>The second/streamer page shows an embedded livestream, chat and list of 10 most recent events for your favorite streamer. This page doesn’t poll the backend and rather leverages web sockets and relevant Twitch API.

While I was able to get the 10 most recent events of the current user, it is not possible to get the events of the current user's favourite streamer without that streamer's authorization. This is because the authorization token of the current user is linked to only to their channel as explained in the offical Twitch PubSub docs seen here:

![twitch_docs](https://github.com/tgritter/streamlabs_assignment/blob/master/readme_images/twitch_docs_auth_token.png)

And explained in discussion threads here:

https://discuss.dev.twitch.tv/t/err-badauth-with-pubsub/10093/2
https://discuss.dev.twitch.tv/t/getting-realtime-channel-events-for-any-channel/19735/2

For example, if I am currently viewing my own channel I am able to listen to my channel's whispers.

![current_user_channel](https://github.com/tgritter/streamlabs_assignment/blob/master/readme_images/current_user_channel.png)

However, if I try to listen to the whispers of another channel, I will receive a BADAUTH error.

![streamers_channel](https://github.com/tgritter/streamlabs_assignment/blob/master/readme_images/favourite_streamer_screenshot.png)

This is intended functionality of the Twitch developers. You cannot receive the events of another's users channel without them going through the authenication flow of this app. 
As such, I have also created a chatbot that will send the current user's favourite streamer a message in their chat requesting that they give access to their events by logging into this app. I have limited events to ones that require any scope for security reasons relating to this issue.

![chatbot](https://github.com/tgritter/streamlabs_assignment/blob/master/readme_images/chatbot_screenshot.png)

This appears to be the only way to fullfil the requirements of this assignment

## QUESTIONS
per https://gist.github.com/osamakhn/14a378f3107d49de47e0b617a3d5fdf5

>How would you deploy the above on AWS? (ideally a rough architecture diagram will help)

To deploy this App on AWS, I would start by using AWS Elastic Beanstalk (EBS). EBS is a service for deploying and scaling web apps to the the Amazon Elastic Compute Cloud (EC2) instances. It allows for Auto-Scaling of EC2 instances as the app scales to increase performance and prevent the app from using too many instances during low useages. EC2 instances are needed to provide secure, resizable and compute capacity in the cloud. It is used to handle user requests to access the application. I would also use an Amazon Virtual Private Cloud (VPC) to create a virtual network for the app. This would increase my control over how users access my network, as well as give greater security to the App. As this app uses PostgresQL to store user information, I will also use the Amazon Relational Database Service (RDS) to set up the database. RDS is used to handle database administration tasks, and can be used on several database instance types including PostgresQL which is used in this project. Finally I will also imploy Redis to to allow for in-memory storage of data to increase the performance and scalability of the app. A rough architecture diagram of this deployment stragety can be seen below:

![architecture_diagram](https://github.com/tgritter/streamlabs_assignment/blob/master/readme_images/architecture_diagram.png)

>Where do you see bottlenecks in your proposed architecture and how would you approach scaling this app starting from 100 reqs/day to 900MM reqs/day over 6 months?

The bottlenecks I see in my proposed architecture are requests to the EC2 instances, and requests to the RDS databases. 
To handle scaling to the EC2 instances, I would use Elastic Beanstalk. Elastic Beanstalk works by adding or remove EC2 instances based on the requests loads. For instance, if EBS detects that the traffic from an EC2 instance is higher than 6 MiB, it will add more instances to handle the load. This will help the app scale as it receives more requests over a 6 month period. 
To handle scaling to the RDS database, I will use Redis. Redis works by storing data in-memory rather than storing data on disk like databases such as PostgresQL. This prevents requests from having to make a round-trip to the disk everytime a request is stored. This will reduce processing time and resources when users send a request to the database. This will make the app more efficient as it scales and must handle more requests.

Other stragetries I might employ:
* Implement client-side caching of the database where appropriate
* Optimize clients to make fewer requests to application
* Ensuring my database is properly indexed
* Have an aggressive timeout solution
* Refactor code to increase optimization
