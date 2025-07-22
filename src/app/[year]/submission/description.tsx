import React from "react"

export function Description() {
    return (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", marginLeft: "1rem"}}>
            <label htmlFor="project-description">Project Description:</label>
            <textarea 
                name="project-description"
                id="project-description"
                style={{ border: "1px solid #000", padding: "0.25rem 0.5rem", borderRadius: "4px", width: "665px", height: "222px" }}
            />
        </div>

    )
}