// Parse the markdown-like response into sections
export function parseDiagnosisResponse(response) {
  if (!response) return {}

  const sections = {
    summary: [],
    differential: {
      mostLikely: [],
      other: [],
    },
    discussion: [],
    approach: {
      immediate: [],
      imaging: [],
      labs: [],
      additional: [],
    },
    disclaimer: "",
  }

  // Split the response by sections
  const lines = response.answer.split("\n")
  let currentSection = null
  let currentSubsection = null

  for (const line of lines) {
    // Identify sections
    if (line.includes("Summary of Patient Presentation")) {
      currentSection = "summary"
      currentSubsection = null
      continue
    } else if (line.includes("Differential Diagnosis")) {
      currentSection = "differential"
      currentSubsection = null
      continue
    } else if (line.includes("Discussion of Top Considerations")) {
      currentSection = "discussion"
      currentSubsection = null
      continue
    } else if (line.includes("Suggested Diagnostic Approach")) {
      currentSection = "approach"
      currentSubsection = null
      continue
    } else if (line.includes("Disclaimer")) {
      currentSection = "disclaimer"
      currentSubsection = null
      continue
    }

    // Identify subsections
    if (currentSection === "differential") {
      if (line.includes("Most Likely/Critical")) {
        currentSubsection = "mostLikely"
        continue
      } else if (line.includes("Other Considerations")) {
        currentSubsection = "other"
        continue
      }
    } else if (currentSection === "approach") {
      if (line.includes("Immediate Actions")) {
        currentSubsection = "immediate"
        continue
      } else if (line.includes("Imaging")) {
        currentSubsection = "imaging"
        continue
      } else if (line.includes("Laboratory Tests")) {
        currentSubsection = "labs"
        continue
      } else if (line.includes("Additional Considerations")) {
        currentSubsection = "additional"
        continue
      }
    }

    // Process content based on current section and subsection
    if (currentSection === "summary") {
      if (line.trim().startsWith("-")) {
        sections.summary.push(line.trim().substring(1).trim())
      }
    } else if (currentSection === "differential") {
      if (currentSubsection && line.trim().startsWith("-")) {
        sections.differential[currentSubsection].push(line.trim().substring(1).trim())
      }
    } else if (currentSection === "discussion") {
      if (line.trim().startsWith("-")) {
        sections.discussion.push(line.trim().substring(1).trim())
      }
    } else if (currentSection === "approach") {
      if (currentSubsection && line.trim().startsWith("-")) {
        sections.approach[currentSubsection].push(line.trim().substring(1).trim())
      }
    } else if (currentSection === "disclaimer") {
      if (line.trim() && !line.includes("Disclaimer")) {
        sections.disclaimer += line.trim() + " "
      }
    }
  }

  return sections
}

// Sample API response structure for testing
export const sampleDiagnosisResponse = {
  answer:
    "Thank you for providing this clinical scenario. I understand the urgency of the situation, and I'll provide a differential diagnosis along with suggested next steps. Let's break this down:\n\n1. **Summary of Patient Presentation**:\n   - 28-year-old woman\n   - Sudden-onset severe headache\n   - Neck stiffness\n   - Brief loss of consciousness\n   - High mortality without immediate intervention\n   - Potential for improved survival with timely neurosurgical or endovascular treatment\n\n2. **Differential Diagnosis**:\n\na) Most Likely/Critical:\n   - Subarachnoid Hemorrhage (SAH)\n   - Ruptured cerebral aneurysm\n\nb) Other Considerations:\n   - Meningitis (bacterial or viral)\n   - Cerebral venous sinus thrombosis\n   - Cervical artery dissection\n   - Pituitary apoplexy\n   - Reversible cerebral vasoconstriction syndrome (RCVS)\n\n3. **Discussion of Top Considerations**:\n\nSubarachnoid Hemorrhage (SAH) / Ruptured Cerebral Aneurysm:\n- The sudden-onset severe headache, often described as a \"thunderclap headache,\" is classic for SAH.\n- Neck stiffness is a common finding due to meningeal irritation from blood in the subarachnoid space.\n- Loss of consciousness can occur at the time of rupture.\n- The high mortality without intervention and potential for improved outcomes with timely treatment align with the natural history of SAH.\n- SAH is most commonly caused by a ruptured cerebral aneurysm in this age group.\n\n4. **Suggested Diagnostic Approach**:\n\na) Immediate Actions:\n   - Stabilize the patient: Ensure airway, breathing, and circulation are adequate.\n   - Neurological examination, including Glasgow Coma Scale.\n   - Check vital signs, with attention to blood pressure management.\n\nb) Imaging:\n   - Non-contrast CT scan of the head (urgent): This is the first-line imaging test for suspected SAH.\n   - If CT is negative but suspicion remains high, consider lumbar puncture to look for xanthochromia.\n   - CT angiography (CTA) or digital subtraction angiography (DSA) to identify and characterize any aneurysms.\n\nc) Laboratory Tests:\n   - Complete blood count\n   - Coagulation profile (PT, PTT, INR)\n   - Basic metabolic panel\n   - Toxicology screen (to rule out other causes of altered mental status)\n\nd) Additional Considerations:\n   - Neurosurgical or interventional neuroradiology consultation for potential urgent intervention.\n   - Continuous cardiac monitoring and frequent neurological checks.\n   - Consider nimodipine administration to prevent vasospasm if SAH is confirmed.\n\n5. **Disclaimer**:\nThis differential diagnosis is generated to assist clinical reasoning but is not a substitute for professional medical judgment. The suggestions provided should be verified and interpreted by qualified healthcare professionals in the context of the specific patient scenario. The differential diagnosis generated is based solely on the information provided and may change significantly with additional clinical details. This tool does not provide definitive medical advice, diagnosis, or treatment recommendations. In case of medical emergency, contact emergency services immediately.\n\nGiven the potentially life-threatening nature of this presentation, immediate medical attention and rapid diagnostic workup are crucial. The focus should be on quickly confirming or ruling out subarachnoid hemorrhage, as this diagnosis requires urgent intervention to improve outcomes.",
}
