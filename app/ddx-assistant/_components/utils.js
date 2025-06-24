// parseDiagnosisResponseV2.js
export function parseDiagnosisResponse(response) {
  if (!response || !response.answer) {
    return {
      overview: [],
      possibilities: [],
      reasoning: [],
      nextSteps: [],
      disclaimer: "",
    };
  }

  // Initialize all new sections
  const sections = {
    overview: [],
    possibilities: [],
    reasoning: [],
    nextSteps: [],
    disclaimer: "",
  };

  // We'll extract text line by line, using headings as markers.
  const lines = response.answer.split("\n");
  let current = null;

  // Helper regex to match headings or question/numbered list.
  const headingMatchers = [
    { regex: /Summary of Patient Presentation/i, section: "overview" },
    { regex: /Differential Diagnosis/i, section: "possibilities" },
    { regex: /Discussion of Top Considerations/i, section: "reasoning" },
    { regex: /Suggested Diagnostic Approach/i, section: "nextSteps" },
    { regex: /Disclaimer/i, section: "disclaimer" }
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Set the current section if line matches a heading
    for (let matcher of headingMatchers) {
      if (matcher.regex.test(line)) {
        current = matcher.section;
        // Disclaimer is a special case: capture everything after, so join and break
        if (current === "disclaimer") {
          // Grab everything else as disclaimer, skip heading line
          sections.disclaimer = lines.slice(i + 1).join(" ").trim();
          return sections;
        }
        // Don't process the heading line itself
        line === lines[i] && i++;
        break;
      }
    }

    // Process lines for each section
    if (!line) continue; // skip empty lines

    // Overview: bullet points (- or numbered)
    if (current === "overview" && /^(-|\d+\.)\s?/.test(line)) {
      sections.overview.push(line.replace(/^(-|\d+\.)\s?/, "").trim());
    }

    // Possibilities: a) b) c) etc.
    else if (current === "possibilities" && /^[a-eA-E]\)/.test(line)) {
      sections.possibilities.push(line.replace(/^[a-eA-E]\)\s?/, "").trim());
    }

    // Reasoning: - bullet points or a) b) explanation blocks
    else if (current === "reasoning") {
      // capture multi-line explanations like 'a) ...' and their bullets
      if (/^[a-eA-E]\)/.test(line)) {
        // Begin a new diagnosis explanation (e.g., 'a) Idiopathic Pulmonary Fibrosis (IPF):')
        sections.reasoning.push(line.replace(/^[a-eA-E]\)\s?/, "").trim());
      } else if (line.startsWith("-")) {
        // Bulleted reason for the last diagnosis
        const last = sections.reasoning.length - 1;
        if (last >= 0) {
          // Attach as subtext or group, or just push
          sections.reasoning.push(line.replace(/^-/, "").trim());
        }
      }
    }

    // Next Steps: - bullets or numbered
    else if (current === "nextSteps" && (/^(-|\d+\.)\s?/.test(line))) {
      sections.nextSteps.push(line.replace(/^(-|\d+\.)\s?/, "").trim());
    }
  }

  return sections;
}
