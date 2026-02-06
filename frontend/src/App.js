import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('accordion-production.up.railway.app/api/procedures')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Procedures</h1>
      {items.map(item => (
        <div key={item.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
          <h3>{item.title}</h3>
          <ReactMarkdown>{item.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

export default App;