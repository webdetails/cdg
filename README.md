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

Version 1 of CDG is called by editing a kettle transformation. In the source
you'll find a _src_ directory but that is our "development area". The code you
need to use is inside kettle.


Once you open the transformation in `kettle/generateDW.ktr` you'll see the following:

![CDG kettle transformation](http://www.webdetails.pt/cdg/cdg-kettle.png)


There are only 2 things that need to be changed:

1. In transformation properties you defined the name of the database and fact table

2. In _Dimension Info_ you configure the transformation parameters


Change the parameters you want (or just run with the default), run the
transformation, and 3 files will appear in the output directory: database and
table ddl, insert scripts and [Mondrian](http://mondrian.pentaho.org) schema
file.


Configuring totals
------------------

Inside the _Dimension Info_ step you'll find a mention to the total:


	/* SET THE APPROXIMATE TOTAL FOR THE VALUES */
	var total = 5000;


This will be _approximate_ total for all the breakdowns. We need to specify
something within the order of magnitude of what we're trying to show. CDG will
then take that value and randomize it.




