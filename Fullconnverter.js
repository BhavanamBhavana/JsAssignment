var fs = require("fs");
var count =1;
var arr=[];
var start = 0,
    end = 54;
var asianctry = ["Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Myanmar", "Cambodia", "China", "India", "Indonesia", "Iraq",
    "Israel", "Japan", "Jordan", "Kazakhstan", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Nepal","Oman", "Pakistan", "Philippines",
    "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan",
    "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"];
var headers=[];
var result = [];
var object = {};

function csvJSON(fileName,op1,op2){

  for(var d = 0; d <= 54 ;d++){
       arr[d]=
       {
           year:d+1960,
           urban:0,
           rural:0
       };
     }
 var inStream=fs.createReadStream(fileName);
 var wstream = fs.createWriteStream(op2);
 wstream.write("[");
 var lineRead=require("readline").createInterface({
   input:inStream
 });

 lineRead.on("line", function (line) {
    var data = line.toString();
    if(count==1)
    {
      headers = data.split(",");
      count=0;
    }
    else{
      // Part -1 of assignemt results in creaation of output1.json
    if( data.includes("India") &&
    (data.includes("Urban population (% of total)") || data.includes("Rural population (% of total population)"))){
      var cline = data.split(",");
      var obj = {};
      for(var j=0;j<cline.length ;j++)
      {
        if(j==0 || j==2 || j==4 ||j==5){
          if(j==4){
            obj[headers[j]] = parseInt(cline[j]);
          }
        else{
          obj[headers[j]] = cline[j];
        }
        }

      }
      result.push(obj);
      fs.writeFile(op1, JSON.stringify(result), function(err) {
        if (err) throw err;
        console.log('It\'s saving!');
      });
    }//end of prg1 IF


    // Part- 2 results in creation of array of objectss
    var dlines;
    if(data.includes("Urban population")||data.includes("Rural population")){
      dlines = data.split(",");
    for (var i = 0; i < dlines.length; i++) {
      object[headers[i]] = dlines[i];
    }
    for (var j = start ; j <= end ; j++){
      if(arr[j].year==object["Year"]){
        if(asianctry.indexOf(object["CountryName"]) != -1){
             if(object["IndicatorName"]=="Urban population"){
               arr[j].urban=arr[j].urban+parseFloat(object["Value"]);
             }
             if(object["IndicatorName"]=="Rural population"){
               arr[j].rural=arr[j].rural+parseFloat(object["Value"]);
             }
         }
      }
    }
  }

  }//end of else
  });
  arr.sort(function(a,b){
    return parseInt(b.year)-parseInt(a.year);
  });
  inStream.on("end", function(){
    for (var k=start;k<=end;k++){
      wstream.write(JSON.stringify(arr[k]));
      if(k!=end){ wstream.write(",");}
    }
    wstream.write("]");
    console.log("Data Written into file");
  });
}


csvJSON("Indicators.csv","output1.json","output2.json");
