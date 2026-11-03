/** Navbar behaviour: mobile menu, submenus, desktop dropdowns, scroll state. */
function initNavbar() {
        const nav = document.querySelector("nav");
        if (!nav) return;

        const mobileBtn = document.getElementById("mobile-menu-btn");
        const mobileMenu = document.getElementById("mobile-menu");
        const iconOpen = document.getElementById("mobile-icon-open");
        const iconClose = document.getElementById("mobile-icon-close");
        const topBar = nav.querySelector("[data-topbar]");

        function setMobileMenu(isOpen) {
            if (!mobileMenu || !mobileBtn) return;
            if (isOpen) {
                mobileMenu.classList.remove("hidden");
                mobileBtn.setAttribute("aria-expanded", "true");
                iconOpen?.classList.add("hidden");
                iconClose?.classList.remove("hidden");
            } else {
                mobileMenu.classList.add("hidden");
                mobileBtn.setAttribute("aria-expanded", "false");
                iconOpen?.classList.remove("hidden");
                iconClose?.classList.add("hidden");
            }
        }

        function closeAllSubmenus() {
            const subMenus = nav.querySelectorAll("[data-menu]");
            const subBtns = nav.querySelectorAll("[data-menu-btn]");
            subMenus.forEach((menu) => menu.classList.add("hidden"));
            subBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
        }

        // ── Desktop dropdown coordination ─────────────────────────────────
        // Close every desktop dropdown except the one passed in (or all if none)
        function closeDesktopDropdowns(except = null) {
            const groups = nav.querySelectorAll("[data-desktop-dropdown]");
            groups.forEach((group) => {
                if (group === except) return;
                const menu = group.querySelector("[data-desktop-menu]");
                const btn  = group.querySelector("[data-desktop-btn]");
                const arrow = btn?.querySelector(".desktop-btn-arrow");
                if (menu) {
                    menu.classList.remove("opacity-100", "visible", "translate-y-0", "pointer-events-auto");
                    menu.classList.add("opacity-0", "invisible", "translate-y-1", "pointer-events-none");
                }
                if (btn) btn.setAttribute("aria-expanded", "false");
                if (arrow) arrow.classList.remove("rotate-180", "opacity-100");
            });
        }

        function openDesktopDropdown(group) {
            const menu  = group.querySelector("[data-desktop-menu]");
            const btn   = group.querySelector("[data-desktop-btn]");
            const arrow = btn?.querySelector(".desktop-btn-arrow");
            if (!menu) return;
            menu.classList.remove("opacity-0", "invisible", "translate-y-1", "pointer-events-none");
            menu.classList.add("opacity-100", "visible", "translate-y-0", "pointer-events-auto");
            if (btn) btn.setAttribute("aria-expanded", "true");
            if (arrow) arrow.classList.add("rotate-180", "opacity-100");
        }

        function isDesktopDropdownOpen(group) {
            const menu = group.querySelector("[data-desktop-menu]");
            return menu && menu.classList.contains("visible");
        }

        // Attach events to each desktop dropdown group
        nav.querySelectorAll("[data-desktop-dropdown]").forEach((group) => {
            const btn  = group.querySelector("[data-desktop-btn]");
            const menu = group.querySelector("[data-desktop-menu]");

            // Click button: toggle this menu, close all others
            btn?.addEventListener("click", (e) => {
                e.stopPropagation();
                const wasOpen = isDesktopDropdownOpen(group);
                closeDesktopDropdowns();
                if (!wasOpen) openDesktopDropdown(group);
                btn.blur(); // prevent focus-trap
            });

            // Hover into the group: close others, open this
            group.addEventListener("mouseenter", () => {
                closeDesktopDropdowns(group);
                openDesktopDropdown(group);
            });

            // Hover out: close this group
            group.addEventListener("mouseleave", () => {
                closeDesktopDropdowns();
            });

            // Clicking a link inside closes the dropdown
            menu?.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => closeDesktopDropdowns());
            });
        });

        // Close desktop dropdowns on outside click
        document.addEventListener("click", (e) => {
            if (!nav.contains(e.target)) closeDesktopDropdowns();
        });

        // Close desktop dropdowns on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeDesktopDropdowns();
        });
        // ─────────────────────────────────────────────────────────────────

        // Submenu accordion toggles (mobile dropdowns)
        const subButtons = nav.querySelectorAll("[data-menu-btn]");
        subButtons.forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const key = btn.dataset.menuBtn;
                const menu = document.getElementById(`menu-${key}`);
                if (!menu) return;

                const isCurrentlyOpen = !menu.classList.contains("hidden");
                closeAllSubmenus();

                if (!isCurrentlyOpen) {
                    menu.classList.remove("hidden");
                    btn.setAttribute("aria-expanded", "true");
                }
            };
        });

        // Mobile main menu toggle button
        if (mobileBtn) {
            mobileBtn.onclick = (e) => {
                e.stopPropagation();
                const isCurrentlyOpen = !mobileMenu?.classList.contains("hidden");
                setMobileMenu(!isCurrentlyOpen);
            };
        }

        // Close when clicking mobile menu links
        mobileMenu?.querySelectorAll("a").forEach((link) => {
            link.onclick = () => {
                closeAllSubmenus();
                setMobileMenu(false);
            };
        });

        // Scroll listener for topbar hiding & shadow
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (topBar) {
                topBar.classList.toggle("hidden", currentScrollY > 50);
            }
            nav.classList.toggle("shadow-md", currentScrollY > 30);
        };

        window.removeEventListener("scroll", handleScroll);
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Close on outer click
        document.onclick = (e) => {
            if (!nav.contains(e.target)) {
                closeAllSubmenus();
                setMobileMenu(false);
            }
        };

        // Close on Escape key
        document.onkeydown = (e) => {
            if (e.key === "Escape") {
                closeAllSubmenus();
                setMobileMenu(false);
            }
        };

        // Auto close mobile menu if screen resized to desktop (>= 1024px)
        window.onresize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenu(false);
                closeAllSubmenus();
            }
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNavbar);
    } else {
        initNavbar();
    }
    document.addEventListener("astro:page-load", initNavbar);
