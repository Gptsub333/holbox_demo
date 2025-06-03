import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism"
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql"
import json from "react-syntax-highlighter/dist/esm/languages/prism/json"

SyntaxHighlighter.registerLanguage("sql", sql)
SyntaxHighlighter.registerLanguage("json", json)

// Interface CodeBlockProps removed
// Type annotations for props (code, language, className) removed

export default function CodeBlock({ code, language, className }) {
  return (
    <div className={`rounded-xl overflow-hidden bg-gray-100 text-sm shadow-inner ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={coy}
        customStyle={{ margin: 0, padding: "1rem", backgroundColor: "transparent" }}
        wrapLongLines={true}
        lineNumberStyle={{ color: "#adb5bd" }}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
