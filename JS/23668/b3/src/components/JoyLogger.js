// components/JoyLogger.js
import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

function JoyLogger({ joyLogs, setJoyLogs }) {
  const [joyMoment, setJoyMoment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (joyMoment.trim()) {
      const newLog = {
        id: Date.now(),
        moment: joyMoment,
        date: new Date().toISOString(),
      };
      setJoyLogs([...joyLogs, newLog]);
      setJoyMoment('');
    }
  };

  return (
    <div>
      <h2 className="mb-3">Log Your Joy</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={joyMoment}
            onChange={(e) => setJoyMoment(e.target.value)}
            placeholder="What made you happy today?"
          />
        </Form.Group>
        <Button variant="primary" type="submit">Log Joy</Button>
      </Form>
      <ListGroup className="mt-3">
        {joyLogs.map((log) => (
          <ListGroup.Item key={log.id}>{log.moment}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default JoyLogger;