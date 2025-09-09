---
layout: default
title: Home
---

# Welcome to My Site

*Last updated: <span id="last-updated">checking…</span>*

## About This Site

Welcome to my personal site dedicated to fansubbing resources and guides. This site hosts various documentation and tutorials related to Aegisub, typesetting, and KFX (karaoke effects).

### Featured Content

- Backups of old aegisub documentation and and Unanimated's TS guide
- Perspective motion techniques (kinda outdated but still somewhat relevant for the trackig part)
- Work-In-Progress KFX guide with examples
- Typesetting keyboard shortcuts and workflows




<script>
(function () {
  const repos = [
    "Zahuczky/zahuczkys-kfx-guide",
    "Zahuczky/zahuczky.com" 
  ];
  const el = document.getElementById("last-updated");

  async function latestCommitISO(fullName) {
    const url = `https://api.github.com/repos/${fullName}/commits?per_page=1`;
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28"
        },
        cache: "no-store"
      });

      if (res.status === 404) return { fullName, iso: null, reason: "private_or_missing" };
      if (res.status === 409) return { fullName, iso: null, reason: "empty_repo" };
      if (!res.ok) throw new Error(`${res.status}`);

      const data = await res.json();
      const c = data && data[0];
      const iso = c?.commit?.committer?.date || c?.commit?.author?.date || null;
      return { fullName, iso, reason: iso ? "ok" : "no_commit" };
    } catch (e) {
      return { fullName, iso: null, reason: "network_or_other" };
    }
  }

  (async () => {
    const results = await Promise.all(repos.map(latestCommitISO));
    const candidates = results.filter(r => r.iso);
    if (!candidates.length) {
      el.textContent = "unavailable";
      return;
    }

    const latest = candidates.reduce((a, b) => (new Date(a.iso) > new Date(b.iso) ? a : b));
    const d = new Date(latest.iso);

    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Budapest",
      dateStyle: "long",
      timeStyle: "short"
    }).format(d);

  const repoUrl = `https://github.com/${latest.fullName}`;
  el.innerHTML = `${fmt} (from <a href="${repoUrl}" target="_blank" rel="noopener">${latest.fullName}</a>)`;
    try { localStorage.setItem(cacheKey, JSON.stringify({ text, savedAt: Date.now() })); } catch (_) {}
  })();
})();
</script>
<noscript>Last updated: {{ site.time | date: "%b %-d, %Y %H:%M %Z" }}</noscript>
