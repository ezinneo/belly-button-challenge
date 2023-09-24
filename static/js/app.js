let data; // Declare data as a global variable

// Load JSON data from the URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(function(jsonData) {
    // Store the JSON data in the global 'data' variable
    data = jsonData;

    // Call the function to populate the dropdown menu
    populateDropdown();

    // Initialize the chart with the first sample in the dropdown
    updateBarChart(data.names[0]);
    
    // Initialize the bubble chart with the first sample in the dropdown
    updateBubbleChart(data.names[0]);
  })
  .catch(function(error) {
    console.error("Error reading JSON data from URL:", error);
  });

// Function to update the bar chart based on the selected sample ID
function updateBarChart(selectedSampleID) {
    // Find the selected sample data
    const selectedSample = data.samples.find(sample => sample.id === selectedSampleID);
  
    // Get the top 10 sample values, OTU IDs, and OTU labels for the bar chart
    const top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    const top10OTUIds = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();
  
    // Create the horizontal bar chart
    const trace = {
      type: 'bar',
      x: top10SampleValues,
      y: top10OTUIds,
      orientation: 'h',
      text: top10OTULabels,
    };
  
    const layout = {
      title: 'Top 10 OTUs for Selected Sample',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' },
    };
  
    Plotly.newPlot('barChart', [trace], layout);
}

// Function to update the bubble chart based on the selected sample ID
function updateBubbleChart(selectedSampleID) {
  // Find the selected sample data
  const selectedSample = data.samples.find(sample => sample.id === selectedSampleID);

  // Use otu_ids for x values, sample_values for y values, sample_values for marker size,
  // otu_ids for marker colors, and otu_labels for text values
  const trace = {
    type: 'scatter',
    mode: 'markers',
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    text: selectedSample.otu_labels,
    marker: {
      size: selectedSample.sample_values,
      color: selectedSample.otu_ids,
      colorscale: 'Viridis', // You can choose a different color scale if needed
      opacity: 0.7,
    },
  };

  const layout = {
    title: 'Bubble Chart for Selected Sample',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' },
  };

  // Check if the 'bubbleChart' element exists before plotting
  if (document.getElementById('bubbleChart')) {
    Plotly.newPlot('bubbleChart', [trace], layout);
  }
}

// Function to populate the dropdown menu with sample IDs
function populateDropdown() {
  const selectDropdown = document.getElementById('selDataset');
  data.names.forEach(sampleID => {
    const option = document.createElement('option');
    option.text = sampleID;
    option.value = sampleID;
    selectDropdown.appendChild(option);
  });

  // Add event listeners to the dropdown to update both charts when a new sample is selected
  selectDropdown.addEventListener('change', function() {
    updateBarChart(this.value);
    updateBubbleChart(this.value);
  });
}

  
  
  
  
  
  
