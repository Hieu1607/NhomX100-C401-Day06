import React from "react";

function PromptSuggestions({ prompts, disabled, onSelectPrompt }) {
  return (
    <div className="suggestions">
      <div className="section-label">Prompt ideas</div>
      <h2>Câu hỏi mẫu để demo nhanh</h2>
      <p className="helper-text">
        Khi context sinh viên đã được khóa, bạn có thể bấm một câu hỏi mẫu để kiểm tra flow ngay.
      </p>

      <div className="suggestions__list">
        {prompts.map((prompt) => (
          <button
            className="suggestion-button"
            disabled={disabled}
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            type="button"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PromptSuggestions;
