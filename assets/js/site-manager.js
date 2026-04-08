/**
 * Site Manager - Dynamic Content Hydrator
 * This script fetches settings from the API and updates the DOM elements.
 */
(async function() {
    try {
        // We use a public settings endpoint (we need to create this in api/index.js)
        const response = await fetch('/api/settings');
        const result = await response.json();
        
        if (!result.success) return;
        const settings = result.data;

        // 1. Update SEO Meta Tags
        if (settings.SITE_TITLE) document.title = settings.SITE_TITLE;
        
        const metaMap = {
            'description': settings.SEO_DESCRIPTION,
            'keywords': settings.SEO_KEYWORDS,
            'og:title': settings.SITE_TITLE,
            'og:description': settings.SEO_DESCRIPTION,
            'twitter:title': settings.SITE_TITLE,
            'twitter:description': settings.SEO_DESCRIPTION
        };

        for (const [name, value] of Object.entries(metaMap)) {
            if (!value) continue;
            let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
            if (el) el.setAttribute('content', value);
        }

        // 2. Update Dynamic Content (Elements with data-setting attribute)
        // Example: <span data-setting="CONTACT_PHONE">...</span>
        document.querySelectorAll('[data-setting]').forEach(el => {
            const key = el.getAttribute('data-setting');
            if (settings[key]) {
                // If it's a link (like tel: or mailto:)
                if (el.tagName === 'A') {
                    if (key.includes('PHONE')) el.href = `tel:${settings[key]}`;
                    if (key.includes('EMAIL')) el.href = `mailto:${settings[key]}`;
                    if (key.includes('WHATSAPP')) el.href = `https://wa.me/${settings[key].replace(/\D/g, '')}`;
                }
                
                // Update text content
                el.textContent = settings[key];
            }
        });

    } catch (error) {
        console.error('Site Manager Error:', error);
    }
})();
