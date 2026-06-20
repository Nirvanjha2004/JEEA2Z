import React from 'react';
import katex from 'katex';

export default function MathText({ text, className }) {
  if (!text) return null;
  
  // Split the text by '$' to separate normal text from math text
  const parts = text.split('$');
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Even indices are normal text, odd indices are math text
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        } else {
          try {
            const html = katex.renderToString(part, {
              throwOnError: false,
              displayMode: false
            });
            return (
              <span 
                key={index} 
                dangerouslySetInnerHTML={{ __html: html }}
                className="inline-block px-[2px] align-middle"
              />
            );
          } catch (err) {
            console.error('Error rendering math:', err);
            return <span key={index}>${part}$</span>;
          }
        }
      })}
    </span>
  );
}
