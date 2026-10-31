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
            const label = document.getElementById('sortLabel');
            if (label) label.textContent = item.querySelector('.sort-text')?.textContent || item.textContent;
        }
    });
});

// Filter actions preserve the active search/sort; any changed filter restarts pagination.
document.addEventListener('DOMContentLoaded',()=>{
 const form=document.getElementById('categoryFilters');if(!form)return;
 const fields=['brand','minPrice','maxPrice','size','color','available','sale'];const current=new URL(location.href);
 fields.forEach(k=>{const el=form.elements.namedItem(k);if(!el)return;if(el.type==='checkbox')el.checked=current.searchParams.get(k)==='true';else el.value=current.searchParams.get(k)||'';});
 const clear=document.getElementById('clearCategoryFilters');if(clear)clear.hidden=!fields.some(k=>current.searchParams.has(k));
 form.addEventListener('submit',event=>{event.preventDefault();const url=new URL(location.href);fields.forEach(k=>url.searchParams.delete(k));const data=new FormData(form);for(const [k,v] of data)if(String(v).trim())url.searchParams.set(k,String(v));url.searchParams.delete('page');location.assign(url.pathname+url.search);});
 clear?.addEventListener('click',()=>{const url=new URL(location.href);fields.forEach(k=>url.searchParams.delete(k));url.searchParams.delete('page');location.assign(url.pathname+url.search);});
});
