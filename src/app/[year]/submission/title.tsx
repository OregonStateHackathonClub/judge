import React from "react"

export function Title() {
    return (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", marginLeft: "1rem"}}>
            <label htmlFor="project-title">Project Title:</label>
            <input 
                type="text" 
                name="project-title"
                id="project-title"
                style={{ border: "1px solid #000", padding: "0.25rem 0.5rem", borderRadius: "4px", width: "665px", marginLeft: "50px"}}
                />
        </div>
)
}