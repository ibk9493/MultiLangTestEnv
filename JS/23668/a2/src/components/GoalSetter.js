// components/GoalSetter.js
import React, { useState } from 'react';

function GoalSetter({ goals, setGoals }) {
  const [newGoal, setNewGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newGoal.trim()) {
      const goal = {
        id: Date.now(),
        text: newGoal,
        completed: false,
      };
      setGoals([...goals, goal]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  return (
    <div>
      <h2>Positivity Goals</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter a new positivity goal"
        />
        <button type="submit">Add Goal</button>
      </form>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoal(goal.id)}
            />
            <span style={{ textDecoration: goal.completed ? 'line-through' : 'none' }}>
              {goal.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoalSetter;