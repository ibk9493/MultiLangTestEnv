// components/ReflectionNotes.js
import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

function ReflectionNotes({ reflections, setReflections }) {
  const [note, setNote] = useState('');

  const saveReflection = (e) => {
    e.preventDefault();
    if (note) {
      const newReflection = {
        id: Date.now(),
        text: note,
        date: new Date().toISOString()
      };
      setReflections([...reflections, newReflection]);
      setNote('');
    }
  };

  return (
    <div>
      <h2 className="mb-3">Reflections & Gratitude</h2>
      <Form onSubmit={saveReflection}>
        <Form.Group className="mb-3">
          <Form.Control 
            as="textarea" 
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your reflections or things you are grateful for..."
          />
        </Form.Group>
        <Button variant="primary" type="submit">Save</Button>
      </Form>
      <div className="mt-3">
        {reflections.map(reflection => (
          <Card key={reflection.id} className="mb-2">
            <Card.Body>
              <Card.Text>{reflection.text}</Card.Text>
              <Card.Subtitle className="text-muted">
                {new Date(reflection.date).toLocaleDateString()}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReflectionNotes;