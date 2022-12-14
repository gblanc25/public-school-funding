class Bricks {

    constructor(parentElement, data) {

        this.parentElement = parentElement;
        this.data = data;
        this.displayData = data;

        // code from https://stackoverflow.com/questions/64700810/javascript-add-rounded-percentages-up-to-100
        this.round_to_100 = function(arr) {
            let output = [];
            let acc = 0;

            for(let i = 0; i < arr.length; i++) {
                let roundedCur = Math.round(arr[i]);
                const currentAcc = acc;
                if (acc == 0) {
                    output.push(roundedCur);
                    acc += arr[i];
                    continue;
                }
                acc += arr[i];
                output.push(Math.round(acc) - Math.round(currentAcc));
            }

            return output;
        }

        this.initVis();
    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {

        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

        // Set dynamic width, height, and svg
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width;
        vis.height = 0.6 * vis.width;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append("g")
            .attr("transform", "translate(" + 0 + "," + vis.margin.top + ")");

        // for sake of transition, remove all existing rects
        vis.svg.selectAll('rect').remove();

        let temp_data = Array(100);

        let bricks = vis.svg.selectAll('rect')
            .data(temp_data);

        // append initial brick outlines, before states are selected
        bricks.enter().append('rect')
            .attr('x', function (d, i) {
                return (vis.margin.left / 2 + ((vis.width - 1.1 * vis.margin.left - vis.width / 15) / 9) * (i % 10));
            })
            .attr('y', function (d, i) {
                return Math.floor(i / 10) * (vis.height / 10);
            })
            .transition()
            .delay(function(d,i){ return 50*i; })
            .duration(50)
            .attr('width', vis.width / 15)
            .attr('height', 15)
            .attr('stroke', 'black')
            .attr('fill', 'transparent')
    }

    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        vis.state = selectedState;

        // include only data about our state
        this.filteredData = this.data.filter(function (d) {
            return (d.State === vis.state);
        })

        // grab percentages of each outcome from the dictionary
        outcomes = [this.filteredData[0]['cat1_18to24'], this.filteredData[0]['cat2_18to24'],
            this.filteredData[0]['cat3_18to24'], this.filteredData[0]['cat4_18to24']];

        // round each value to integers, still sum to 100
        vis.roundedData = vis.round_to_100(outcomes);

        vis.displayData = [];

        // create a 100 value array with numbers corresponding to each category (1 per brick)
        for (let i = 0; i < (vis.roundedData).length; i++) {
            for (let j = 0; j < vis.roundedData[i]; j++) {
                vis.displayData.push(i);
            }
        }

        // randomize array
        //vis.shuffle(vis.displayData);

        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {
        let vis = this;

        // update data above graph
        if (vis.parentElement === 'bricks-1') {
            document.getElementById('select-state1').innerHTML = vis.state;
            document.getElementById('brick-subtitle1').innerHTML = "Local Funding: " + selectedFunding;
            document.getElementById('stat1c').innerHTML = "Some College: " + vis.roundedData[2] + "%";
            document.getElementById('stat1d').innerHTML = "Bachelor's: " + vis.roundedData[3] + "%";
            document.getElementById('stat1a').innerHTML = "Some High School: " + vis.roundedData[0] + "%";
            document.getElementById('stat1b').innerHTML = "High School Grad: " + vis.roundedData[1] + "%";
        }

        else {
            document.getElementById('select-state2').innerHTML = vis.state;
            document.getElementById('brick-subtitle2').innerHTML = "Local Funding: " + selectedFunding;
            document.getElementById('stat2a').innerHTML = "Some College: " + vis.roundedData[2] + "%";
            document.getElementById('stat2b').innerHTML = "Bachelor's: " + vis.roundedData[3] + "%";
            document.getElementById('stat2c').innerHTML = "Some High School: " + vis.roundedData[0] + "%";
            document.getElementById('stat2d').innerHTML = "High School Grad: " + vis.roundedData[1] + "%";

        }

        vis.svg.selectAll('rect').remove();

        let bricks = vis.svg.selectAll('rect')
            .data(vis.displayData);

        // append bricks with transition and corresponding colors
        bricks.enter().append('rect')
            .attr('x', function (d, i) {
                return (vis.margin.left / 2 + ((vis.width - 1.1 * vis.margin.left - vis.width / 15) / 9) * (i % 10));
            })
            .attr('y', function (d, i) {
                return Math.floor(i / 10) * (vis.height / 10);
            })
            .transition()
            .delay(function(d,i){ return 50*i; })
            .duration(50)
            .attr('width', vis.width / 15)
            .attr('height', 15)
            .attr('opacity', 0.7)
            .attr('stroke', 'black')
            .attr('fill', function (d) {
                if (d === 0) {
                    return 'tan';
                }
                else if (d === 1) {
                    return '#58776c';
                }
                else if (d === 2) {
                    return 'darkred';
                }
                else {
                    return 'gray';
                }
            })
    }
}
