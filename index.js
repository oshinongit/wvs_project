d3.csv("GHG.csv").then(function(data) {
    //console.log(data); // [{"Hello": "world"}, …]


    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i].Year == "1999") {
            console.log(data[i]);
        }
        
}
    
    });




