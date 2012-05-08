CDG - Community Data Generator
==============================


About
-----


CDG is a datawarehouse generator. Given the definition of dimensions that we
want, CDG will randomize data within certain parameters and output 3 different things:


* Database and table ddl for the fact table
* A file with inserts for the fact table
* Mondrian schema file to be used within pentaho


While most of the documentation mentions the usage within the scope of
[Pentaho](http://www.pentaho.com) there's absolutely nothing that prevents the
resulting database to be used in different contexts.


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


Configuring Totals
------------------

Inside the _Dimension Info_ step you'll find a mention to the total:


	/* SET THE APPROXIMATE TOTAL FOR THE VALUES */
	var total = 5000;


This will be _approximate_ total for all the breakdowns. We need to specify
something within the order of magnitude of what we're trying to show. CDG will
then take that value and randomize it.


Configuring Dimensions
----------------------


In the same file you configure the dimensions. You can have as much as you
want, just paying attention to the fact that if you use a lot of dimensions /
high cardinality we can quickly end up with a *huge* database. While there's
nothing particularly wrong with that, it's then up to you to do specific
optimizations like indexes or even aggregate tables. That's outside the scope
of CDG.


Here's a sample dimension definition:

	var countries = [
	  {countryName: "Italianos", proportion: 30},  
	  {countryName: "Portugueses", proportion: 18},  
	  {countryName: "Alemães", proportion: 12},  
	  {countryName: "Espanhóis", proportion: 10},  
	  {countryName: "Japoneses", proportion: 15},  
	  {countryName: "Coreanos", proportion: 8},  
	  {countryName: "Chineses", proportion: 3},  
	  {countryName: "Outros", proportion: 5}  
	];


By defining this object, CDG will create a dimension with 8 members and one
level called _countryName_. You could have other properties in there and CDG
would create a mondrian schema with different levels. The provided example has
only one.


There's a special property in there called _proportion_. That will be used by
CDG to do the breakdown of the total. In the example, _roughly_ 30% of the
total will be assigned to Italians and so on. In all aspects of the code there's a random
factor.





