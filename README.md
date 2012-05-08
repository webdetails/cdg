CDG - Community Data Generator
==============================


About
-----


CDG is a datawarehouse generator. Given the definition of dimensions that we
want, CDG will randomize data within certain parameters and output 3 different things:


* Database and table ddl for the fact table
* A file with inserts for the fact table
* Mondrian schema file to be used within pentaho



Motivation
----------

Several times, [webdetails](http://www.webdetails.pt) had to prepare dummy data
to feed dashboards / demonstrations. The traditional approach is always one of the following:

1. Use data from steel-wheels (the [pentaho](http://www.pentaho.com) sample datawarehouse)

2. Build specific transformation to return static pieces of data


Both have severe disadvantages. With number one, we found out that not only the
datawarehouse has severe inconsistencies, worst of all the end customers most
of the time can't transpose to their business terms like trains and cars.

For number 2, while we can build specific sets, it ends up being time consuming
and since it's not a full datawarehouse we can't show all the abilities of the
solution we're demonstrating.


So we decided to build CDG - a datawarehouse generator that we can quickly use
to build scenarios where the end consumer can feel comfortable with.


Usage
-----



