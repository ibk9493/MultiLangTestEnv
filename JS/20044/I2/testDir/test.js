// TODO: Refactor this function for better performance - John - High - In Progress
function calculateTotals(data) {
    let total = 0;
    // TODO: Handle edge cases for empty data arrays - Jane - Medium - Open
    if (data.length > 0) {
      data.forEach(item => {
        total += item.value;
      });
    }
    return total;
  }
  
  // TODO: Add unit tests for this function - Alex - Low - Open
  function processData(input) {
    return input.map(i => i * 2);
  }
  