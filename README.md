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
to build scenarios where the end consumer can feel comfortable with, written
with [Kettle](http://kettle.pentaho.org/)


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


_The sample provided in CDG is in Portuguese to specifically test character
encoding support. The generated files are in UTF-8 and we recommend always
using utf-8 in the database too_


By defining this object, CDG will create a dimension with 8 members and one
level called _countryName_. You could have other properties in there and CDG
would create a mondrian schema with different levels. The provided example has
only one.


There's a special property in there called _proportion_. That will be used by
CDG to do the breakdown of the total. In the example, _roughly_ 30% of the
total will be assigned to Italians and so on. In all aspects of the code
there's a random factor in place.


Configuring Date Dimension
--------------------------

The date dimension is always a specific case, since most of the times acts as a
_snapshot dimension_. 


Since configuring all possible members of this dimension would be very time
consuming, we provide an utility function that generates all the dates between
2000 and 2012 down to the month. This is standard javascript, so feel free to
change this function either to change the date range, month names or even
adding the day level (be aware that adding the day level will substantially increase
the number of values in the fact table)


	/* CONFIGURE THE DATE DIMENSION. */

	var dateDim = [];

	var months = [
		[1,"Jan","Janeiro"],    [2,"Fev","Fevereiro"],    [3,"Mar","Março"],    [4,"Abr","Abril"],
		[5,"Mai","Maio"],    [6,"Jun","Junho"],    [7,"Jul","Julho"],    [8,"Ago","Agosto"],
		[9,"Set","Setembro"],    [10,"Out","Outubro"],    [11,"Nov","Novembro"],  
		[12,"Dec","Dezembro"]
	];

	range(2000,2012).map(function(year){
		range(0,12).map(function(month){
			var m = months[month];
			dateDim.push(
				{"year":year ,"monthNo": m[0], "monthAbbrev":m[1], "monthDesc": m[2]}
			);
		});
	});
	;


Final configuration
-------------------

In the end of the script there's the final configuration that will be used by CDG:


	/* MAKE THE FINAL CONFIGURATION. DIMENSIONS CAN EITHER BE SNAPSHOT OR REGULAR BREAKDOWNS */ 

	var outputArray = [
		
		{name: "Date", dimension: dateDim, toBreakdown: false, increment: 0.05 }, 
		{name: "Provices", dimension: provinces, toBreakdown: true },
		{name: "Countries", dimension: countries, toBreakdown: true },
		{name: "Dates", dimension: gender, toBreakdown: true } 
	 
	 ]


In here we define the names and types of the dimension. The property of _toBreakdown_ should be _true_ for normal dimensions and _false_ for snapshot dimensions. If it's a snapshot dimension, you need to specify the _increment_ property. This value of 0.05 basically means that we'll have _roughly_ 5% increase each month.


You can then run the transformation.


Output
------

After running the transformation, we get this output:

	cdg/kettle/output
	├── cdgsample.ddl
	├── cdgsample.mondrian.xml
	`── cdgsample.sql




1. A _ddl_ file to create the database and the table
2. A file with _sql_ inserts to populate the datawarehouse
3. A mondrian schema file to use within mondrian / import to pentaho


![Schema workbench](http://www.webdetails.pt/cdg/cdg-workbench.png)


Result
------

The result, after declaring this new datasource and registring the cube in
mondrian, is a new cube that we can use.

![Saiku](http://www.webdetails.pt/cdg/cdg-saiku.png)


Issues, bugs and feature requests
---------------------------------


In order to report bugs, issues or feature requests, please use the [Webdetails CDG Project Page](http://redmine.webdetails.org/projects/cdg/issues)


License
-------

CDG is licensed under the [MPLv2](http://www.mozilla.org/MPL/2.0/) license.


