(() => {
    const sidebarTemplate = `
        <div class="section-block sidebar__profile">
            <div class="section-label" data-lang="sidebar_profile_heading">Personal profile</div>
            <p data-lang="sidebar_profile_body">I am a researcher working on on-device AI and GPU memory systems. My work focuses on developing structural optimization techniques that enable large-scale models to run reliably even under limited hardware resources.</p>
        </div>
        <div class="section-block sidebar__education">
            <div class="section-label" data-lang="sidebar_education_heading">Education</div>
            <div class="section-stack">
                <div>
                    <strong data-lang="sidebar_education_one">University of Seoul · M.S. Electrical and Computer Engineering</strong><br>
                    <span data-lang="sidebar_education_one_sub">2025 - Present</span>
                </div>
                <div>
                    <strong data-lang="sidebar_education_two">University of Seoul · B.S. Electrical and Computer Engineering</strong><br>
                    <span data-lang="sidebar_education_two_sub">2019 - 2025</span>
                </div>
            </div>
        </div>
        <div class="section-block sidebar__contact">
            <div class="section-label" data-lang="sidebar_contact_heading">Contact</div>
            <ul class="meta-list">
                <li class="meta-item">
                    <span data-lang="sidebar_contact_email_label">Email</span>
                    <strong data-lang="sidebar_contact_email_value">wnsgjs34@gmail.com</strong>
                </li>
                <li class="meta-item">
                    <span data-lang="sidebar_contact_phone_label">Phone</span>
                    <strong data-lang="sidebar_contact_phone_value">+82-10-7182-9744</strong>
                </li>
                <li class="meta-item">
                    <span data-lang="sidebar_contact_location_label">Location</span>
                    <strong data-lang="sidebar_contact_location_value">Seoul, South Korea</strong>
                </li>
                <li class="meta-item">
                    <span data-lang="sidebar_contact_site_label">Website</span>
                    <strong data-lang="sidebar_contact_site_value">junon-lee.pages.dev</strong>
                </li>
            </ul>
        </div>
    `;

    function injectSidebar() {
        const targets = document.querySelectorAll("[data-sidebar]");
        if (!targets.length) return;

        targets.forEach(target => {
            target.classList.add("sidebar");
            target.innerHTML = sidebarTemplate;
        });

        if (typeof applyLang === "function") {
            applyLang();
        }
    }

    document.addEventListener("DOMContentLoaded", injectSidebar);
})();
