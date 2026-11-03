/** Site search modal: lazy index loading, filtering, keyboard shortcuts. */
function initSiteSearch() {
		const root = document.querySelector("[data-site-search-root]");
		if (!root || root.dataset.searchReady === "1") return;
		root.dataset.searchReady = "1";

		let searchI18n = {};
		try {
			searchI18n = JSON.parse(root.dataset.i18n || "{}");
		} catch {
			searchI18n = {};
		}

		const modal = root.querySelector("[data-search-modal]");
		const backdrop = root.querySelector("[data-search-backdrop]");
		const input = root.querySelector("[data-search-input]");
		const resultsEl = root.querySelector("[data-search-results]");
		const emptyEl = root.querySelector("[data-search-empty]");
		const hintEl = root.querySelector("[data-search-hint]");
		const statusEl = root.querySelector("[data-search-status]");

		if (!modal || !input || !resultsEl) return;

		/** @type {{ title: string, url: string, category: string, keywords: string }[]} */
		let index = [];
		let indexLoaded = false;
		let indexLoading = false;
		let cachedLang = null;

		function normalize(text) {
			return String(text)
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
		}

		function filterItems(query) {
			const q = normalize(query.trim());
			if (!q) return [];
			return index
				.filter((item) => {
					const haystack = normalize(
						`${item.title} ${item.keywords} ${item.category}`,
					);
					return haystack.includes(q);
				})
				.slice(0, 12);
		}

		function renderResults(query) {
			const items = filterItems(query);
			resultsEl.innerHTML = "";

			if (!query.trim()) {
				emptyEl?.classList.add("hidden");
				hintEl?.classList.remove("hidden");
				statusEl?.classList.add("hidden");
				return;
			}

			hintEl?.classList.add("hidden");

			if (items.length === 0) {
				emptyEl?.classList.remove("hidden");
				statusEl?.classList.add("hidden");
				return;
			}

			emptyEl?.classList.add("hidden");
			statusEl?.classList.remove("hidden");
			if (statusEl) statusEl.textContent = `${items.length} ${searchI18n.resultsFound}`;

			items.forEach((item) => {
				let resultUrl;
				try {
					resultUrl = new URL(item.url, window.location.origin);
				} catch {
					console.error("Skipping search result with an invalid URL.");
					return;
				}
				if (resultUrl.origin !== window.location.origin) {
					console.error("Skipping search result with a non-local URL.");
					return;
				}

				const li = document.createElement("li");
				li.setAttribute("role", "option");
				const a = document.createElement("a");
				a.href = `${resultUrl.pathname}${resultUrl.search}${resultUrl.hash}`;
				a.className =
					"flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group";
				const title = document.createElement("span");
				title.className = "text-sm font-medium text-slate-800 group-hover:text-[#004d2c]";
				title.textContent = item.title;
				const category = document.createElement("span");
				category.className = "text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0";
				category.textContent = item.category;
				a.append(title, category);
				a.addEventListener("click", closeModal);
				li.appendChild(a);
				resultsEl.appendChild(li);
			});
		}

		async function loadIndex() {
			// Invalidate cache if language changed
			if (cachedLang !== searchI18n.lang) {
				indexLoaded = false;
				cachedLang = searchI18n.lang;
			}
			if (indexLoaded || indexLoading) return;
			indexLoading = true;
			if (statusEl) {
				statusEl.classList.remove("hidden");
				statusEl.textContent = searchI18n.loading;
			}
			try {
				const res = await fetch(`/api/search-index.json?lang=${searchI18n.lang}`);
				if (res.ok) {
					index = await res.json();
					indexLoaded = true;
				}
			} catch {
				if (statusEl) statusEl.textContent = searchI18n.loadError;
			} finally {
				indexLoading = false;
				if (!indexLoaded && statusEl) {
					statusEl.textContent = searchI18n.unavailable;
				} else if (indexLoaded) {
					statusEl?.classList.add("hidden");
				}
			}
		}

		function openModal() {
			modal.classList.remove("hidden");
			modal.classList.add("flex");
			document.body.style.overflow = "hidden";
			loadIndex().then(() => {
				input.value = "";
				renderResults("");
				input.focus();
			});
		}

		function closeModal() {
			modal.classList.add("hidden");
			modal.classList.remove("flex");
			document.body.style.overflow = "";
		}

		document.querySelectorAll("[data-search-trigger]").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.stopPropagation();
				openModal();
			});
		});

		backdrop?.addEventListener("click", closeModal);

		input.addEventListener("input", () => {
			renderResults(input.value);
		});

		document.addEventListener("keydown", (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				if (modal.classList.contains("hidden")) openModal();
				else closeModal();
			}
			if (e.key === "Escape" && !modal.classList.contains("hidden")) {
				closeModal();
			}
		});
	}

	document.addEventListener("DOMContentLoaded", initSiteSearch);
	document.addEventListener("astro:page-load", initSiteSearch);
