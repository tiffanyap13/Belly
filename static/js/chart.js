function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar and Bubble charts

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // console.log("samples", samples)
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = samples.filter(sampleObj => sampleObj.id == sample);
    // console.log("num", sampleNumber)
    // Create a variable that holds the first sample in the array.
    var firstArray = sampleNumber[0];
    // Object.entries(firstArray).forEach(([key, value]) => {
    //  ;
    // });

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otu_ids = samples[0].otu_ids;
    // var otu_labels = samples[0].otu_labels;
    // var sample_values = samples[0].sample_values;
    var otu_ids = firstArray.otu_ids;
    var otu_labels = firstArray.otu_labels;
    var sample_values = firstArray.sample_values;
        
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 

    // Using the slice() method and map() and reverse() functions, 
    // retrieve the top 10 otu_ids and sort them in descending order.
    
    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var xticks = sample_values.slice(0, 10).reverse();
    // console.log(yticks)
    // Create the trace for the bar chart. 
  
    var trace = {
      x: xticks,
      y: yticks,
      type: 'bar',
      orientation: 'h'
    };
    var barData = [trace];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      width: 400, height: 400,
      font: {
        family: 'Balto',
        size: 15,
        color: "navy"}
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
    
    var ids = otu_ids;
    var values = sample_values;
    var labels = otu_labels;

    var trace1 = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        color: ids,
        size: values
      }
    };
    var bubbleData = [trace1];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      margin: {t:-2},
      hovermode: "closest",
      font: {
        family: 'Balto',
        size: 15,
        color: "navy"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
//     In Step 1, create a variable that filters the metadata array for an object in the 
//     array whose id property matches the ID number passed into buildCharts() function as the argument.
// In Step 2, create a variable that holds the first sample in the array created in Step 2.
// In Step 3, create a variable that converts the washing frequency to a floating point number.
//     // Assign the variable created in Step 3 to the value property.
    var washingFrequency = null;
    // GET WASHING FREQUENCY
    var metadata = data.metadata;
    var result = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    Object.entries(result).forEach(([key, value]) => {
      if (key === "wfreq"){
        washingFrequency = value;
      }
    });    
    // 4. Create the trace for the gauge chart.
    var trace2 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: washingFrequency,
      title: "<b>Belly Button Washing Frequency</b> <br> <b>Scrubs Per Week</b>",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "darkblue" },
        steps: [
          { range: [0, 2], color: "gray" },
          { range: [2, 4], color: "cyan" },
          { range: [4, 6], color: "blue" },
          { range: [6, 8], color: "purple" },
          { range: [8, 10], color: "magenta" }
        ],
      }
    };
      
    var gaugeData = [trace2];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 400, height: 400, margin: { t: 0, b: 0 },
    font: {
      family: 'Balto',
      size: 15,
      color: "navy"},};

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  })
  };
