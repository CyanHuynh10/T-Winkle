document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const params = new URLSearchParams(location.search);
    input.value = params.get('keyword') || '';
    const clear = document.getElementById('clearSearchBtn');
    const updateClear = () => clear?.classList.toggle('d-none', !input.value);
    const search = () => {
        const url = new URL(location.href);
        if (input.value.trim()) url.searchParams.set('keyword', input.value.trim());
        else url.searchParams.delete('keyword');
        url.searchParams.delete('page');
        location.href = url.pathname + url.search;
    };
    updateClear(); input.addEventListener('input', updateClear);
    input.addEventListener('keydown', e => {if(e.key === 'Enter'){e.preventDefault();search();}});
    document.getElementById('searchSubmitBtn')?.addEventListener('click', search);
    clear?.addEventListener('click', () => {input.value = ''; search();});
    document.querySelectorAll('.sort-dropdown-item').forEach(item => {
        const rule = item.dataset.sort || item.getAttribute('data-value');
        const url = new URL(location.href);
        url.searchParams.set('sort', rule); url.searchParams.delete('page');
        item.href = url.pathname + url.search;
        const active = (params.get('sort') || 'popular') === rule;
        item.classList.toggle('selected-sort', active);
        item.setAttribute('aria-current', active ? 'true' : 'false');
        if (active) {
            document.getElementById('sortLabel').textContent = item.querySelector('.sort-text')?.textContent || item.textContent;
        }
    });
});
