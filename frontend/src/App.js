import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import LoadingSpinner from './LoadingSpinner';

const ContentRenderer = ({ content }) => {
  if (!content) return null;

  switch (content.type) {
    case 'bulleted_list':
      return (
        <ul>
          {content.items.map((item, index) => (
            <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
          ))}
        </ul>
      );

    case 'numbered_list':
      return (
        <ol>
          {content.items.map((item, index) => (
            <li key={index}><ReactMarkdown>{item}</ReactMarkdown></li>
          ))}
        </ol>
      );

    case 'lettered_list':
      const startChar = content.start_char ? content.start_char.toLowerCase() : 'a';
      const startNum = startChar.charCodeAt(0) - 96;
      return (
        <ol style={{ listStyleType: 'lower-alpha' }} start={startNum}>
          {content.items.map((item, index) => (
            <li key={index}>
              <ReactMarkdown>{item}</ReactMarkdown>
            </li>
          ))}
        </ol>
      );
      
    default:
      return <div>Unsupported content type</div>;
  }
};

function App() {
  const [items, setItems] = useState([]);
  const [openIds, setOpenIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = 'https://accordion-production.up.railway.app/api/procedures';

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then(data => {
        setItems(data);
        if (data && data.length > 0) {
          setOpenIds([data[0].id]);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Could not load procedures. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleToggle = (id) => {
    setOpenIds(prevOpenIds => {
      if (prevOpenIds.includes(id)) {
        return prevOpenIds.filter(existingId => existingId !== id);
      } 
      else {
        return [...prevOpenIds, id];
      }
    });
  };

  return (
    <div className="container">
      <h1 className="main-title">
        ПРОЦЕДУРЫ РОЗЫСКА ПОСЫЛОК,
        <br />
        А ТАКЖЕ ОФОРМЛЕНИЯ ЗАЯВЛЕНИЙ О ПОВРЕЖДЕНИИ ИЛИ УТРАТЕ
      </h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="accordion">
          {items.map((item) => {
            const isOpen = openIds.includes(item.id);
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
                    <ContentRenderer content={item.content} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;