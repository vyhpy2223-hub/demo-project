async function loadHTML(id, file) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadHTML('sidebar', 'partials/sidebar.html');
    await loadHTML('footer', 'partials/footer.html');

    await loadHTML('hero', 'modules/hero.html');
    await loadHTML('progress', 'modules/progress.html');
    await loadHTML('ai-features', 'modules/ai-features.html');
    await loadHTML('learner-features', 'modules/learner-features.html');
    await loadHTML('cta', 'modules/cta.html');

    // Mount progress UI
    if (typeof renderProgress === 'function') {
        renderProgress('progress-mount');
    }
});


