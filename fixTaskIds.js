// Script to fix duplicate taskIds in data.json
const fs = require('fs');
const path = require('path');

// Read the data.json file
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Check if tasks array exists
if (!data.tasks || !Array.isArray(data.tasks)) {
  console.error('No tasks array found in data.json');
  process.exit(1);
}

console.log(`Found ${data.tasks.length} tasks in data.json`);

// Create a map to track which taskIds we've seen
const seenTaskIds = new Map();
let fixedCount = 0;

// Process each task
data.tasks.forEach((task, index) => {
  // If we've already seen this taskId or it doesn't have one
  if (!task.taskId || seenTaskIds.has(task.taskId)) {
    // Generate a new unique taskId based on the original or create a new one
    const originalId = task.taskId || '160000';
    const newTaskId = (parseInt(originalId) + index).toString();

    console.log(
      `Task at index ${index} has duplicate taskId: "${task.taskId}" - changing to "${newTaskId}"`
    );

    // Update the task with the new taskId
    task.taskId = newTaskId;
    fixedCount++;
  }

  // Mark this taskId as seen
  seenTaskIds.set(task.taskId, true);
});

console.log(`Fixed ${fixedCount} duplicate taskIds`);

// Write the updated data back to the file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Updated data.json file successfully!');
