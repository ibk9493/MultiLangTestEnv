// TODO: Refactor this function for better performance - ibk9493 - High - In Progress
function calculateTotals(data) {
    let total = 0;
    // TODO: Handle edge cases for empty data arrays - ibk9493 - Medium - Open
    if (data.length > 0) {
      data.forEach(item => {
        total += item.value;
      });
    }
    return total;
  }
  
  // TODO: Add unit tests for this function - ibk9493 - Low - Open
  function processData(input) {
    return input.map(i => i * 2);
  }
  