// Script to create a new data file with unique taskIds
const fs = require('fs');
const path = require('path');

// Read the data.json file
const dataPath = path.join(__dirname, 'data.json');
const outputPath = path.join(__dirname, 'data-unique-taskids.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Create a deep copy to avoid modifying the original data
const newData = JSON.parse(JSON.stringify(data));

// Check if tasks array exists
if (!newData.tasks || !Array.isArray(newData.tasks)) {
  console.error('No tasks array found in data.json');
  process.exit(1);
}

console.log(`Found ${newData.tasks.length} tasks in data.json`);

// Create a map to track which taskIds we've seen
const seenTaskIds = new Map();
let fixedCount = 0;

// Process each task
newData.tasks.forEach((task, index) => {
  // If we've already seen this taskId or it doesn't have one
  if (!task.taskId || seenTaskIds.has(task.taskId)) {
    // Generate a new unique taskId
    // Starting from 170000 to differentiate from original IDs
    const baseId = 170000;
    const newTaskId = (baseId + index).toString();

    console.log(
      `Task at index ${index} has duplicate taskId: "${task.taskId}" - changing to "${newTaskId}"`
    );

    // Update the task with the new taskId
    task.taskId = newTaskId;
    fixedCount++;
  }

  // Also ensure the main 'id' field is unique
  // If we're updating taskIds, let's also ensure the main id is unique
  if (!task.id || seenTaskIds.has(task.id)) {
    task.id = `task_${Date.now()}_${index}`;
    console.log(`Updated main id for task ${index} to be unique`);
  }

  // Mark these IDs as seen
  seenTaskIds.set(task.taskId, true);
  seenTaskIds.set(task.id, true);
});

console.log(`Fixed ${fixedCount} duplicate taskIds`);

// Write the updated data to a new file
fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2));
console.log(`Created new data file with unique taskIds at: ${outputPath}`);
