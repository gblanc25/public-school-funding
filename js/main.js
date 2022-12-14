let fundingmap;
let fundingmap2;
let barvis;
let outcomes;
let dataforbricks;
let bricks1;
let bricks2;
let bricks_selector1;
let bricks_selector2;
let selectedCategory;
let selectedCategory2;
let selectedState = 'Massachusetts';
let selectedFunding = '';
let sankeyChart;
let sankeyChart2;
let sankeyChart3;

let categories = {
    "total" : "Funding_Total",
    "federal" : "Funding_Federal",
    "state" : "Funding_State",
    "local" : "Funding_Local",
    "total2": "Funding_TotalperStudent",
    "federal2": "Funding_FederalperStudent",
    "state2": "Funding_StateperStudent",
    "local2": "Funding_LocalperStudent"

}

// load data using promises
let promises = [

    // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
    d3.csv("data/fundingData&Attainment.csv")
];

Promise.all(promises)
    .then(function (data) {
        dataforbricks = [data[0], data[1]];
        fundingmap = new GeoVis("funding-geo", data[0], data[1]);
        fundingmap2 = new GeoVis2("funding-geo-2", data[0], data[1]);
        barvis = new BarVis("barDiv", data[1]);
})
    .catch(function (err) {
        console.log(err)
    });


d3.csv("data/fundingData&Attainment.csv", row => {

    // clean data
    row.cat1_18to24 = +(row.cat1_18to24.replace('%', ''));
    row.cat2_18to24 = +(row.cat2_18to24.replace('%', ''));
    row.cat3_18to24 = +(row.cat3_18to24.replace('%', ''));
    row.cat4_18to24 = +(row.cat4_18to24.replace('%', ''));
    row.income = +row.income;
    return row;

}).then(data => {

    outcomes = new OutcomeScatter("outcomes", data);

    bricks1 = new Bricks("bricks-1", data);
    bricks2 = new Bricks("bricks-2", data);

    sankeyChart = new SankeyChart("factors", data);
    sankeyChart2 = new SankeyChart2("factors2", data);
    sankeyChart3 = new SankeyChart3("factors3", data);

});

selectedCategory = "Funding_Total"
selectedCategory2 = "Funding_TotalperStudent"

document.getElementById("total").style.backgroundColor = "#274c43";
document.getElementById("total").style.color = "white";

document.getElementById("total2").style.backgroundColor = "#274c43";
document.getElementById("total2").style.color = "white";

function buttonClick(_this) {
    for (let i = 0; i < 4; i++) {
        document.getElementsByClassName(_this.className)[i].style.backgroundColor = "lightgray";
        document.getElementsByClassName(_this.className)[i].style.color = "black";

    }
    _this.style.backgroundColor = "#274c43";
    _this.style.color = "white";

    if (_this.className === "button"){
        selectedCategory = categories[_this.id]
        fundingmap.updateVis()

    }
    else {
        selectedCategory2 = categories[_this.id]
        fundingmap2.updateVis()
        barvis.wrangleData()

    }

}

// Enable modals for state selection in Bricks vis
document.getElementById("exampleModal1").addEventListener('mouseover', function() {
    if (!bricks_selector1) {
        bricks_selector1 = new GeoVis3("brick-selector1", dataforbricks[0], dataforbricks[1]);
    }
})

document.getElementById("exampleModal2").addEventListener('mouseover', function() {
    if (!bricks_selector2) {
        bricks_selector2 = new GeoVis3("brick-selector2", dataforbricks[0], dataforbricks[1]);
    }
})

let counter = 0;

let n = 0;

// Hide elements in outcome vis as needed when users toggle between two graphs
function advance() {

    if (counter === 0) {
        document.getElementById('federal_check').checked = true;
        document.getElementById('state_check').checked = true;
        document.getElementById('local_check').checked = true;
        document.getElementById('total_check').checked = false;
        document.getElementById('outcome_1').hidden = true;
        document.getElementById('outcome_2').hidden = false;
        document.getElementById('outcome_checks').hidden = false;
        counter++;
        outcomes.wrangleData();
        document.getElementById('outcome_next').innerText = "Restart";
    }

    else {
        document.getElementById('outcome_1').hidden = false;
        document.getElementById('outcome_2').hidden = true;
        document.getElementById('outcome_next').innerText = "Next";
        document.getElementById('federal_check').checked = false;
        document.getElementById('state_check').checked = false
        document.getElementById('local_check').checked = false;
        document.getElementById('total_check').checked = true;
        document.getElementById('outcome_checks').hidden = true;
        counter = 0;
        outcomes.wrangleData();
    }
}
