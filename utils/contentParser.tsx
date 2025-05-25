import React from 'react';

export const renderArticleContentFromString = (content: string): React.ReactNode[] => {
  if (!content) return [];

  const lines = content.split('\n'); // Changed from '\\n' to '\n'
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  lines.forEach((line) => { // Removed index as it's not used
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ')) {
      if (!inList) {
        inList = true;
        listItems = []; // Reset listItems when starting a new list
      }
      listItems.push(trimmedLine.substring(2));
    } else {
      if (inList) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      if (trimmedLine) {
        elements.push(<p key={`p-${elements.length}`}>{trimmedLine}</p>);
      }
    }
  });

  if (inList && listItems.length > 0) {
    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
        {listItems.map((item, itemIndex) => (
          <li key={itemIndex}>{item}</li>
        ))}
      </ul>
    );
  }

  return elements;
};