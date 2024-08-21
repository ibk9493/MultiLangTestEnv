// components/PositivityGoals.js
import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

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
      <h2 className="mb-3">Set Your Positivity Goals</h2>
      <Form onSubmit={addGoal}>
        <Form.Group className="mb-3">
          <Form.Control 
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new goal"
          />
        </Form.Group>
        <Button variant="primary" type="submit">Add Goal</Button>
      </Form>
      <ListGroup className="mt-3">
        {goals.map(goal => (
          <ListGroup.Item key={goal.id}>
            <Form.Check 
              type="checkbox" 
              checked={goal.achieved} 
              onChange={() => toggleAchieved(goal.id)} 
              label={goal.text}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default PositivityGoals;