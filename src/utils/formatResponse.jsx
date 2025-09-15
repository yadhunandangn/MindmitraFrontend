import React from "react";

// Helper to parse **bold** and _italic_
function parseInlineMarkdown(text) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /_(.*?)_/g;

  // First handle bold
  const boldSplit = text.split(boldRegex);
  const final = [];

  for (let i = 0; i < boldSplit.length; i++) {
    if (i % 2 === 1) {
      final.push(<strong key={`b-${i}`}>{boldSplit[i]}</strong>);
    } else {
      // Handle italic inside non-bold parts
      const italicSplit = boldSplit[i].split(italicRegex);
      italicSplit.forEach((chunk, j) => {
        if (j % 2 === 1) {
          final.push(<em key={`i-${i}-${j}`}>{chunk}</em>);
        } else {
          final.push(chunk);
        }
      });
    }
  }

  return final;
}

export const formatDoctors = (doctors) => {
  return doctors.map((doc) => ({
    label: `${doc.name} (${doc.specialization})`,
    value: doc.id,
  }));
};

export function formatAIResponse(response) {
  const lines = response.split("\n").filter((line) => line.trim() !== "");
  const elements = [];

  let listItems = [];

  lines.forEach((line, index) => {
    const content = parseInlineMarkdown(line);

    if (/^(\*|-)\s/.test(line)) {
      listItems.push(
        <li key={`li-${index}`} className="list-disc ml-6 text-gray-800">
          {parseInlineMarkdown(line.replace(/^(\*|-)\s/, ""))}
        </li>
      );
    } else {
      if (listItems.length) {
        elements.push(
          <ul key={`ul-${index}`} className="mb-2">
            {listItems}
          </ul>
        );
        listItems = [];
      }

      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <h2 key={index} className="font-semibold mt-4 text-lg text-black">
            {content}
          </h2>
        );
      } else {
        elements.push(
          <p key={index} className="mt-2 text-gray-700">
            {content}
          </p>
        );
      }
    }
  });

  if (listItems.length) {
    elements.push(<ul key="ul-last">{listItems}</ul>);
  }

  return elements;
}
