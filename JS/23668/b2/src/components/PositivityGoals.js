// components/PositivityGoals.js
import React, { useState } from 'react';

function PositivityGoals({ goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');

  const addGoal = (e) => {
    e.preventDefault();
    if (newGoal) {
      setGoals([...goals, { text: newGoal, achieved: false, id: Date.now() }]);
      setNewGoal('');
    }
  };

  const toggleAchieved = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, achieved: !goal.achieved } : goal
    ));
  };

  return (
    <div>
      <h2>Set Your Positivity Goals</h2>
      <form onSubmit={addGoal}>
        <input 
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter a new goal"
        />
        <button type="submit">Add Goal</button>
      </form>
      <ul>
        {goals.map(goal => (
          <li key={goal.id}>
            <input 
              type="checkbox" 
              checked={goal.achieved} 
              onChange={() => toggleAchieved(goal.id)} 
            />
            {goal.text} {goal.achieved ? '✅' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PositivityGoals;