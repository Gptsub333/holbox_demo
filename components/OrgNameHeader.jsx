// import React, { useState, useEffect, useRef } from "react";

// function OrgNameHeader({ orgName, setOrgName }) {
//   const [editing, setEditing] = useState(false);
//   const [input, setInput] = useState(orgName);
//   const clickCount = useRef(0);
//   const lastClick = useRef(0);
//   const inputRef = useRef(null); // Create a ref for the input element to focus it programmatically

//   // Fetch orgName if it's not passed as a prop
//   useEffect(() => {
//     if (!orgName) {
//       fetchOrgName();
//     }
//   }, []);

//   // Fetch organization name from the API
//   const fetchOrgName = async () => {
//     try {
//       const res = await fetch('/api/org-name');
//       const data = await res.json();
//       if (data.orgName) {
//         setOrgName(data.orgName);
//         setInput(data.orgName); // Set the initial input state
//       }
//     } catch (err) {
//       console.error("Error fetching organization name:", err);
//     }
//   };

//   // Handle the triple-click action to start editing
//   const handleClick = () => {
//     const now = Date.now();
//     if (now - lastClick.current < 500) {
//       clickCount.current += 1;
//     } else {
//       clickCount.current = 1;
//     }
//     lastClick.current = now;

//     if (clickCount.current === 3) {
//       setEditing(true);
//       clickCount.current = 0;
//     }
//   };

//   // Function to update the org name in the backend
//   const updateOrgName = async (newName) => {
//     try {
//       const res = await fetch('/api/org-name', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ orgName: newName }),
//       });
//       const data = await res.json();
//       return data;
//     } catch (err) {
//       console.error("Error updating organization name:", err);
//       return { success: false, error: err.message };
//     }
//   };

//   // Save the updated org name and call the API
//   const handleSave = async () => {
//     try {
//       const response = await updateOrgName(input);
//       if (response.success) {
//         setOrgName(input);  // Update the parent state if the backend update is successful
//         setEditing(false);   // Exit edit mode
//       } else {
//         console.error("Failed to update organization name:", response.error);
//       }
//     } catch (err) {
//       console.error("Error saving organization name:", err);
//     }
//   };

//   // If in editing mode, show an input field
//   if (editing) {
//     return (
//       <span>
//         <input
//           ref={inputRef} // Attach ref to the input
//           autoFocus // Focus the input when editing
//           className="border rounded p-1 text-xs"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//         />
//         <button className="ml-2 text-xs text-blue-600" onClick={handleSave}>
//           Save
//         </button>
//       </span>
//     );
//   }

//   // Otherwise, show the organization name and listen for a triple-click to enable editing
//   return (
//     <span
//       className="ml-2.5 text-md font-medium md:inline-block heading-font cursor-pointer select-none"
//       title="Triple-click to edit"
//       onClick={handleClick}
//     >
//       {orgName}
//     </span>
//   );
// }

// export default OrgNameHeader;
import React, { useState, useEffect, useRef } from "react";

function OrgNameHeader({ orgName, setOrgName }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(orgName);
  const clickCount = useRef(0);
  const lastClick = useRef(0);
  const inputRef = useRef(null); // Create a ref for the input element to focus it programmatically

  // Fetch orgName from localStorage or set default name
  useEffect(() => {
    const savedOrgName = localStorage.getItem("orgName"); // Check if it's already stored
    if (savedOrgName) {
      setOrgName(savedOrgName);
      setInput(savedOrgName); // Set the initial input state from localStorage
    } else {
      setOrgName("Holbox AI Demo"); // Default name
      setInput("Holbox AI Demo");
    }
  }, []);

  // Handle the triple-click action to start editing
  const handleClick = () => {
    const now = Date.now();
    if (now - lastClick.current < 500) {
      clickCount.current += 1;
    } else {
      clickCount.current = 1;
    }
    lastClick.current = now;

    if (clickCount.current === 3) {
      setEditing(true);
      clickCount.current = 0;
    }
  };

  // Save the updated org name locally
  const handleSave = () => {
    localStorage.setItem("orgName", input); // Save to localStorage
    setOrgName(input);  // Update the parent state with the new name
    setEditing(false);   // Exit edit mode
  };

  // If in editing mode, show an input field
  if (editing) {
    return (
      <span>
        <input
          ref={inputRef} // Attach ref to the input
          autoFocus // Focus the input when editing
          className="border rounded p-1 text-xs"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="ml-2 text-xs text-blue-600" onClick={handleSave}>
          Save
        </button>
      </span>
    );
  }

  // Otherwise, show the organization name and listen for a triple-click to enable editing
  return (
    <span
      className="ml-2.5 text-xs font-medium md:inline-block heading-font cursor-pointer select-none"
      title="Triple-click to edit"
      onClick={handleClick}
    >
      {orgName}
    </span>
  );
}

export default OrgNameHeader;

