import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const API_URL = 'https://accordion-production.up.railway.app/api/procedures';

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setItems(data);
          setOpenId(data[0].id);
        }
      })
      .catch(err => console.error("Failed to fetch data:", err));
  }, []);

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="container">
      <h1 className="main-title">
        ПРОЦЕДУРЫ РОЗЫСКА ПОСЫЛОК,
        <br />
        А ТАКЖЕ ОФОРМЛЕНИЯ ЗАЯВЛЕНИЙ О ПОВРЕЖДЕНИИ ИЛИ УТРАТЕ
      </h1>

      <div className="accordion">
        {items.map((item) => {
          const isOpen = item.id === openId;
          return (
            <div key={item.id} className="accordion-item">
              <div className="accordion-header" onClick={() => handleToggle(item.id)}>
                <span>{item.title}</span>
                <span className={`icon ${isOpen ? 'close' : 'open'}`}>
                  {isOpen ? '✕' : '+'}
                </span>
              </div>
              {isOpen && (
                <div className="accordion-body">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;