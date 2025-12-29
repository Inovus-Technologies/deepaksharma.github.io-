/* ================= BUTTON LOGIC ================= */

// Wait for the document to fully load before running script
document.addEventListener("DOMContentLoaded", () => {

    // 1. "View Projects" Button
    // We grab the element by ID "viewProjectsBtn"
    const viewProjectsBtn = document.getElementById("viewProjectsBtn");
    
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener("click", () => {
            console.log("View Projects clicked");
            const projectsSection = document.getElementById("projects");
            if (projectsSection) {
                // Smoothly scroll to the projects section
                projectsSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // 2. Top "Contact" Button
    // We grab the element by ID "contactBtn"
    const contactBtn = document.getElementById("contactBtn");
    
    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            console.log("Top Contact clicked");
            const contactSection = document.getElementById("contactSection");
            if (contactSection) {
                // Smoothly scroll to the bottom CTA section
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // 3. "Get in Touch" Button (Active Email Trigger)
    // We grab the element by ID "finalContactBtn"
    const finalContactBtn = document.getElementById("finalContactBtn");

    if (finalContactBtn) {
        finalContactBtn.addEventListener("click", () => {
            console.log("Final Contact clicked - Opening Mail Client");
            // This line opens the default email app with your address
            window.location.href = "mailto:sharma05deep@gmail.com";
        });
    }
});
