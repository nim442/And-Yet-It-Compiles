var d3 = require('d3');
var $= require('jquery');

var margin = {top: 0, right:0, bottom: 0, left: 0},
            width =600 - margin.left - margin.right,
            height = 370 - margin.top - margin.bottom;
var x=d3.scaleLinear()
    .domain([0, 5])
    .range([30, width]);
var y=d3.scaleLinear()
    .domain([0, 3])
    .range([30, height]);
var svg = d3.select("#gameboard").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


var board=[];
var PythonShell = require('python-shell');
var pyshell = new PythonShell('candyCrisis.py', {pythonPath:'py', scriptPath: '../' });
var emptyPiece;
var emptyPiecePos;
var clickedPiece;
pyshell.on('message', function (message) {
    if (message.substr(0, 2)=="[["){
        message = message.replace(/'/g, '"');
        board=JSON.parse(message)
        initGameBoard(board);
    }
    
});





function updateData(){
   initGameBoard(dummy);  
}
function initGameBoard(data){
    
              
   
   

   
    var oned=function(i){
        return [Math.floor(i/5),i%5];
    }
    var g=svg.selectAll("g").data(data,d=>d[0])
    svg.selectAll("rect").data(data).enter().append("rect")
        .attr("class", "empty-field")
        .attr("x", (d, i) => x(oned(i)[1]))
        .attr("y", (d, i) => y(oned(i)[0]))
        .attr("height", 100)
        .attr("width", 100)
        .attr("rx", 16)
        .attr("ry", 16);

    var gEnter = g.enter().append("g");
   
    g.select(".pieces").transition()
        .duration(750).attr("x",(d,i)=>x(oned(i)[1]))
        .attr("y",(d,i)=>y(oned(i)[0]))
        .attr("display",d=>d[1]=='e'?'none':'')

    g.select(".bots").transition()
        .duration(750).attr("x",(d,i)=>x(oned(i)[1])+4)
        .attr("y",(d,i)=>y(oned(i)[0])+88)
        .attr("display",d=>d[1]=='e'?'none':'')
    g.select(".piece-text").transition()
    .duration(750)
        .attr("x",(d,i)=>x(oned(i)[1])+35)
        .attr("y",(d,i)=>y(oned(i)[0])+60);
    
    gEnter.append("rect")
        .attr("class", d=>d[1]+"-piece pieces")
        .attr("x",(d,i)=>x(oned(i)[1]))
        .attr("y",(d,i)=>y(oned(i)[0]))
        .attr("display",d=>d[1]=='e'?'none':'')
        .attr("height",100)
        .attr("width",100)
        .attr("rx",16)
        .attr("ry",16)
        .on("click",(d,i)=>{
            var p=board.findIndex(e=>e[0]==d[0])
            pyshell.send("("+oned(p)[0]+","+oned(p)[1]+")")
            clickedPiece=i;
            board=[];

        });

    
    gEnter.append("rect")
        .attr("class", d => d[1] +"-bot bots")
        .attr("x",(d,i)=>x(oned(i)[1])+4)
        .attr("y",(d,i)=>y(oned(i)[0])+88)
        .attr("display",d=>d[1]=='e'?'none':'')
        .attr("height",12)
        .attr("width",92)
        .attr("rx",18)
        .attr("ry",30);
    gEnter.append("text").text(d=>d[1])
        .attr("display",d=>d[1]=='e'?'none':'')
        .attr("x",(d,i)=>x(oned(i)[1])+35)
        .attr("y",(d,i)=>y(oned(i)[0])+60)
        .attr("class", "piece-text")

 

   
         
    
   

   
}
