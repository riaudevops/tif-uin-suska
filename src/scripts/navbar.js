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
        //
        // Mouse travel between the button and the panel is not a straight
        // vertical line: the panel is 288px wide and anchored to the left of a
        // much narrower button, so a diagonal movement leaves the group box
        // before it reaches the panel. With an immediate close on `mouseleave`
        // the menu vanished before the pointer arrived (reproduced in
        // Chromium), making items impossible to click.
        //
        // A short grace period fixes that: closing is delayed, and re-entering
        // the group cancels the pending close. A small open delay also keeps
        // the menu from flashing while the pointer sweeps across the navbar.
        const OPEN_DELAY_MS = 120;
        const CLOSE_DELAY_MS = 280;
        let openTimer = null;
        let closeTimer = null;
        /**
         * Set when the user closes a menu with a click while still hovering it.
         * Hover-open stays disabled until the pointer leaves the group so the
         * menu does not immediately pop back up (click behaviour would look
         * broken: "clicked twice, still open").
         */
        let suppressHoverOpen = false;

        function cancelOpenTimer() {
            if (openTimer) {
                clearTimeout(openTimer);
                openTimer = null;
            }
        }

        function cancelCloseTimer() {
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
        }

        function scheduleOpen(group) {
            cancelCloseTimer();
            // Already open: keep it open without waiting for the delay.
            if (isDesktopDropdownOpen(group)) return;
            // The user explicitly closed this menu; wait until they leave.
            if (suppressHoverOpen) return;

            cancelOpenTimer();
            openTimer = setTimeout(() => {
                openTimer = null;
                closeDesktopDropdowns(group);
                openDesktopDropdown(group);
            }, OPEN_DELAY_MS);
        }

        function scheduleClose() {
            cancelOpenTimer();
            cancelCloseTimer();
            closeTimer = setTimeout(() => {
                closeTimer = null;
                closeDesktopDropdowns();
            }, CLOSE_DELAY_MS);
        }

        // Last input modality. Mouse clicks are re-opened/closed by hover
        // shortly after, so the menu is not opened on click in that case.
        // Keyboard (Tab + Enter/Space) has no hover at all and must open it.
        nav.querySelectorAll("[data-desktop-dropdown]").forEach((group) => {
            const btn  = group.querySelector("[data-desktop-btn]");
            const menu = group.querySelector("[data-desktop-menu]");

            // Click button: toggle.
            //
            // `event.detail === 0` means the click came from the keyboard
            // (Enter/Space), where there is no hover to open the menu.
            btn?.addEventListener("click", (e) => {
                e.stopPropagation();
                cancelOpenTimer();
                cancelCloseTimer();
                const fromKeyboard = e.detail === 0;
                const wasOpen = isDesktopDropdownOpen(group);

                if (wasOpen) {
                    closeDesktopDropdowns();
                    // The pointer is still over the button: keep it closed.
                    suppressHoverOpen = !fromKeyboard;
                    return;
                }

                openDesktopDropdown(group);
                suppressHoverOpen = false;
            });

            // Hover into the group (or back into the panel): open/keep open
            group.addEventListener("mouseenter", () => {
                scheduleOpen(group);
            });

            // Hover out: wait briefly so the pointer can reach the panel
            group.addEventListener("mouseleave", () => {
                // Leaving re-arms hover-open for the next visit.
                suppressHoverOpen = false;
                scheduleClose();
            });

            // Keyboard: the button is a real <button>, so Enter/Space toggles
            // it natively. Do NOT auto-open on `focusin` — clicking the button
            // focuses it, which would immediately reopen a menu that the click
            // just closed. Close when focus leaves the group instead.
            group.addEventListener("focusout", (event) => {
                const next = event.relatedTarget;
                if (next instanceof Node && group.contains(next)) return;
                // `btn.blur()` in the click handler triggers this event; the
                // pointer is still over the menu there, so closing would
                // immediately undo a click that just opened it.
                if (group.matches(":hover")) return;
                scheduleClose();
            });

            // Clicking a link inside closes the dropdown
            menu?.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    cancelOpenTimer();
                    cancelCloseTimer();
                    closeDesktopDropdowns();
                });
            });
        });

        // Leaving the navbar entirely should close without waiting too long
        nav.addEventListener("mouseleave", () => {
            scheduleClose();
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
