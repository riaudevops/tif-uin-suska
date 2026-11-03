/** Accordion toggles for the curriculum page. */
function initAccordions() {
    const triggers = document.querySelectorAll('[data-accordion-trigger]');
    triggers.forEach((trigger) => {
      const newTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(newTrigger, trigger);

      newTrigger.addEventListener('click', () => {
        const version = newTrigger.getAttribute('data-accordion-trigger');
        const content = document.querySelector(`[data-accordion-content="${version}"]`);
        const icon = newTrigger.querySelector('[data-accordion-icon]');
        const isExpanded = newTrigger.getAttribute('aria-expanded') === 'true';

        newTrigger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');

        if (!isExpanded) {
          content?.classList.remove('hidden');
          icon?.classList.add('rotate-180');
        } else {
          content?.classList.add('hidden');
          icon?.classList.remove('rotate-180');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAccordions);
  document.addEventListener('astro:page-load', initAccordions);
