# Introduction 
This project is supposed to  retireve Tweets data and process it into insights in order to specify and filter specific tweets corresponding to the implemented (structured) insights. The user through this project should be able to identify the insights' details.

# Getting Started
Guide for the Web Application:
1.	The user is expected to access the website through the link "localhost:5555:IRProject/"
2.	The application contsists of 3 main usecases that the user will be able to procceed through:
    * Geographic Location: The user will be expected to set through a map the Geographic points to retrieve tweets in the selected area.
    * Time Interval: The user will be expected to detect the time-span of the tweets that they need to retrieve.
    * Search Specifications: The user will be expected to enter a word or a sentence in order to check whether it exists in the content of the tweet.
3. The application is built through the agile software engineering method, meaning that there will be different releases regarding the content of the application:	
    * Version 1:
        1. Gneerating the map, the time intervals in the front end.
        2. Generating restFUL APIs to match with the system's front end.
        3. Applying ElasticSearch for queries' content.
    * Version 1.1 (final):
        1. Generating more insights for more user specifications.
        2. Generating the backend of the new insights.

_________________________________________________________________________________________________________________________________________________________________________
## TBS (To be specified)
# Build and Test
I used react framework for the front end side of this project and used python flask for the back end sdie of the project.
main libraries used:
   1-leaf-let: a library that allows you to display the world map with the right coordinates on ur screen, we used this library so we could be able to view the map                      and be able to retrieve tweets from a certain location.
   2-elastic search: we used elastic search to index the tweets we had, and helps us search for them in a much easier way through multiple queries.
   
The way I used to retrieve the exact coordinates is by creating a component that allows you to choose a bounding box on the map displayed by leaf-let library, then by taking both bounding box right-top corner and bottom-left corner we get all the tweets inside those coordinates using elastic search query bounding-box.

# Insights
I added multiple features which are:
   1-Exact tweets coordinates on the map displayed as a marker.
   2-Bag of words with the most common words being displayed in a bigger shape.
   3-Box-plot showing the distripution of the tweets sorted either by day, month or year.
   4-Top ranked tweets retrived, ranked by the likes.
