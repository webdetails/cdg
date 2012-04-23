
//console.clear();


var range = function(start, stop, step) {
  if (arguments.length == 1) {
    stop = start;
    start = 0;
  }
  if (step == undefined) step = 1;
  if ((stop - start) / step == Infinity) throw new Error("range must be finite");
  var array = [], i = 0, j;
  stop -= (stop - start) * 1e-10; // floating point precision!
  if (step < 0) {
    while ((j = start + step * i++) > stop) {
      array.push(j);
    }
  } else {
    while ((j = start + step * i++) < stop) {
      array.push(j);
    }
  }
  return array;
};



var generateRow = function(row){

    var $div = $div || $(".results");
    $div.append(JSON.stringify(row) + "\n");
    // Add this to the div
    
    
}

var tableCreator = function(_arr){
    
    var arr = _arr.slice();
    var dimArray = arr.splice(0,1)[0];
    
    var dimension = dimArray.dimension;
    var cols = dimArray.cols;
    var name = dimArray.name;
    
    // get the first member
    
    var row = dimension[0];
    var sql = "create table " +name +" ( id primary key, " ;
    var i=0;

    var join=[];
    for(var k in row){
        if(k!=="proportion"){
            
            var c = row[k];
            var s = k+ " ";
            if(typeof(c) === "number"){
                s+=" int ";
            }
            else{
                s+=" varchar(64) ";
            }
            join.push(s);
        }
        
    }
    sql+=join.join(",")+");";

    generateRow(sql);

    // iterate until we're finished with dimentions
    if(arr.length > 0){
        tableCreator(arr);
    }
    else{
    /*
            row.push(value);
            rs.push(row);
            generateRow(row);
            row = [];
            */
    }

        
    
    
}

var randomizeData = function(_arr, total, rs, _row){
    
    var arr = _arr.slice();
    var dimArray = arr.splice(0,1)[0];
    
    var dimension = dimArray.dimension;
    var toBreakdown = dimArray.toBreakdown || false;
    var increment = dimArray.increment || 0;
    
    var isFirst = true;
    
    dimension.map(function(memberObj){
        var value;
        var row = _row.slice();
        if(toBreakdown){
            // There's a "proportion" property
            value = total * memberObj.proportion/100 * (1+ 0.3*(0.5 - Math.random()));;
            //console.log(value);
        }
        else{
            // todo
            total += total * increment * (0.75 - Math.random());
            value = total;
        }
        
        // Add the obj properties to the resultset
        for(key in memberObj){
            if(key !== "proportion"){
                row.push(memberObj[key]);
            }
        };
        
    
        // iterate until we're finished with dimentions
        if(arr.length > 0){
            randomizeData(arr , total, rs, row);
        }
        else{
            // no more iterations? add the total and push it to the resultset
            row.push(value);
            rs.push(row);
            generateRow(row);
            row = [];
        }
        
        
        
    });
    

}


var myGenerator = function(args) {

var outputDDL = "";
var mondrianSchema = "";
var outputDML = "";

mondrianSchema = "<Schema name='GeneratedSchema'>";
mondrianSchema += "<Cube name='GeneratedCube'>";
mondrianSchema += "<Table name='facts'/>";


var factTableDDL = "CREATE TABLE facts (";
args.map(function (dimension) {
	outputDDL += "CREATE TABLE " + dimension.name + " (";
		
	var levels = {};
	var columns = {}
		var memberObj = dimension.dimension[0];
		for(var key in memberObj){
			if(key !== "proportion") {
				var index = key.search(/[A-Z]/);
				var levelKey = key;
				if (index != -1)
					levelKey = key.substring(0, index); 
				var levelRep = [];
				if ( levels[levelKey] !== undefined ) {
					levelRep = levels[levelKey];
				} 
				
				var dataType = 'varchar(64)';
				if (typeof( memberObj[key] ) === 'number')
					dataType = 'int';
				
				levelRep.push([key, dataType]);
				levels[levelKey] = levelRep;
			}
		}


	for (var key in levels) {
		var hasId = false;
		var levelAttributes = levels[key];
		for (var t = 0; t < levelAttributes.length; t++) {
			var isId = levelAttributes[t][0].match("Id$")=="Id";
			if (isId) {
				factTableDDL += levelAttributes[t][0] + " " + levelAttributes[t][1]  + ", ";
				hasId = true;
			}
			outputDDL += levelAttributes[t][0] + " " + levelAttributes[t][1]  + ", ";
		}
		if (!hasId) {
			factTableDDL += dimension.name + "Id varchar(20), ";
			outputDDL += dimension.name + "Id varchar(20), ";
		}					
	}


//	factTableDDL += dimension.name + "Id varchar(20), ";
	outputDDL += ");";
});

factTableDDL += " value int(11))";
outputDDL += factTableDDL;

mondrianSchema += "</Cube>";
mondrianSchema += "</Schema>";



generateRow(mondrianSchema);
generateRow(outputDDL);

}


// DEFINE DIMENSIONS

// Generate Date Dimension
var dateDim = [];

var months = [
    [1,"Jan","Janeiro"],
    [2,"Fev","Fevereiro"],
    [3,"Mar","Março"],
    [4,"Abr","Abril"],
    [5,"Mai","Maio"],
    [6,"Jun","Junho"],
    [7,"Jul","Julho"],
    [8,"Ago","Agosto"],
    [9,"Set","Setembro"],
    [10,"Out","Outubro"],
    [11,"Nov","Novembro"],
    [12,"Dec","Dezembro"]
];

range(2010,2011).map(function(year){
    range(0,12).map(function(month){
        var m = months[month];
        dateDim.push(
            {"year":year ,"monthNo": m[0], "monthAbbrev":m[1], "monthDesc": m[2]}
        );
    });
});
;



// var total = 5956430;
var total = 100;


var provinces = [
    {provinceName: "Acre", provinceId: "AC", proportion:3.7},
    {provinceName: "Alagoas", provinceId: "AL", proportion:3.7},
    {provinceName: "Amapá", provinceId: "AP", proportion:3.7},
    {provinceName: "Amazonas", provinceId: "AM", proportion:3.7},
    {provinceName: "Bahia", provinceId: "BA", proportion:3.7},
    {provinceName: "Ceará", provinceId: "CE", proportion:3.7},
    {provinceName: "Distrito Federal", provinceId: "DF", proportion:3.7},
    {provinceName: "Espírito Santo", provinceId: "ES", proportion:3.7},
    {provinceName: "Goiás", provinceId: "GO", proportion:3.7},
    {provinceName: "Maranhão", provinceId: "MA", proportion:3.7},
    {provinceName: "Mato Grosso", provinceId: "MT", proportion:3.7},
    {provinceName: "Mato Grosso do Sul", provinceId: "MS", proportion:3.7},
    {provinceName: "Minais Gerais", provinceId: "MG", proportion:3.7},
    {provinceName: "Pará", provinceId: "PA", proportion:3.7},
    {provinceName: "Paraíba", provinceId: "PB", proportion:3.7},
    {provinceName: "Paraná", provinceId: "PR", proportion:3.7},
    {provinceName: "Pernambuco", provinceId: "PE", proportion:3.7},
    {provinceName: "Piauí", provinceId: "PI", proportion:3.7},
    {provinceName: "Rio de Janeiro", provinceId: "RJ", proportion:3.8},
    {provinceName: "Rio Grande do Norte", provinceId: "RN", proportion:3.7},
    {provinceName: "Rio Grande do Sul", provinceId: "RS", proportion:3.7},
    {provinceName: "Rondónia", provinceId: "RO", proportion:3.7},
    {provinceName: "Roraima", provinceId: "RR", proportion:3.7},
    {provinceName: "Santa Catarina", provinceId: "SC", proportion:3.7},
    {provinceName: "São Paulo", provinceId: "SP", proportion:3.7},
    {provinceName: "Sergipe", provinceId: "SE", proportion:3.7},
    {provinceName: "Tocantins", provinceId: "TO", proportion:3.7},
];


var countries = [
  {countryName: "Italianos", proportion: 30},  
  {countryName: "Portgueses", proportion: 18},  
  {countryName: "Alemães", proportion: 12},  
  {countryName: "Espanhóis", proportion: 10},  
  {countryName: "Japoneses", proportion: 15},  
  {countryName: "Coreanos", proportion: 8},  
  {countryName: "Chineses", proportion: 3},  
  {countryName: "Outros", proportion: 5}  
];


var gender = [
  {genderName: "Homem", proportion: 45},  
  {genderName: "Mulher", proportion: 55}  
];





// Call it

var rs = [];


$(function(){
    
    var configArray = [
        {dimension: dateDim, toBreakdown: false, increment: 0.15 , name:"d_date"}, 
        {dimension: provinces, toBreakdown: true , name: "d_provinces"},
        {dimension: gender, toBreakdown: true, name: "d_gender"} 
        
    ]; 

    // randomizeData( configArray, total, rs,[]);


//     tableCreator(configArray);
myGenerator(configArray);
})

