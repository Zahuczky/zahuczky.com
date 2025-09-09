async function loadGitHubContent(repo, path, elementId) {
    const contentDiv = document.getElementById(elementId);
    if (!contentDiv) return;
    
    contentDiv.innerHTML = '<div style="padding: 2rem; text-align: center;">Loading content...</div>';
    
    try {
        const url = `https://raw.githubusercontent.com/${repo}/main/${path}`;
        console.log('Fetching URL:', url);
        const response = await fetch(url);

        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let html = await response.text();
        
        html = adaptHTMLToDarkTheme(html);
        
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error('Error loading content:', error);
        contentDiv.innerHTML = `
            <div style="padding: 2rem; color: #ff4444;">
                <h3>Error Loading Content</h3>
                <p>Unable to load content from GitHub. Please try again later.</p>
                <p style="font-size: 0.9em; opacity: 0.7;">Error: ${error.message}</p>
            </div>
        `;
    }
}

function adaptHTMLToDarkTheme(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    temp.querySelectorAll('*[style]').forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
            const newStyle = style
                .replace(/background(-color)?:\s*(white|#fff|#ffffff)/gi, 'background-color: transparent')
                .replace(/color:\s*(black|#000)/gi, 'color: #e0e0e0');
            el.setAttribute('style', newStyle);
        }
    });
    
    temp.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        heading.style.color = '#ff4444';
    });
    
    temp.querySelectorAll('pre').forEach(pre => {
        pre.style.background = '#252525';
        pre.style.padding = '1rem';
        pre.style.borderRadius = '8px';
        pre.style.color = '#e0e0e0';
        pre.style.border = '1px solid #333';
    });
    
    temp.querySelectorAll('code').forEach(code => {
        if (!code.closest('pre')) {
            code.style.background = '#252525';
            code.style.padding = '0.2rem 0.4rem';
            code.style.borderRadius = '4px';
            code.style.color = '#ff4444';
        }
    });
    
    return temp.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const contentElements = document.querySelectorAll('[data-github-content]');
    contentElements.forEach(element => {
        const repo = element.dataset.githubRepo || 'Zahuczky/zahuczkys-kfx-guide';
        const path = element.dataset.githubContent;
        if (path) {
            loadGitHubContent(repo, path, element.id);
        }
    });
});
