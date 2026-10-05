// Cart and Product Detail use the same parsing, bounds and delegated interactions.
window.TwQuantity = {
    parse(value, maximum) {
        const raw = String(value).trim(), number = Number(raw), max = Number(maximum);
        return /^\d+$/.test(raw) && Number.isSafeInteger(number) && number >= 1 &&
            Number.isSafeInteger(max) && number <= max && number <= 2147483647 ? number : null;
    },
    bind(root, options) {
        const inputSelector = options.input, stepSelector = options.step;
        const scopeOf = el => options.scope ? el.closest(options.scope) : root;
        function commit(input, value) {
            const scope = scopeOf(input), parsed = window.TwQuantity.parse(value, input.max);
            if (parsed === null) {
                input.value = input.dataset.committed || '1';
                options.invalid?.(scope, input);
                return;
            }
            options.commit(scope, parsed, input);
        }
        root.addEventListener('click', e => {
            const button = e.target.closest(stepSelector);
            if (!button || !root.contains(button) || button.disabled) return;
            e.preventDefault();
            const scope = scopeOf(button), input = scope.querySelector(inputSelector);
            const current = window.TwQuantity.parse(input.value, input.max);
            commit(input, (current ?? Number(input.dataset.committed || 1)) + Number(button.dataset.quantityStep ?? button.dataset.cartStep));
        });
        root.addEventListener('change', e => {if(e.target.matches(inputSelector)) commit(e.target, e.target.value);});
        root.addEventListener('input', e => {if(e.target.matches(inputSelector)) options.draft?.(scopeOf(e.target), e.target);});
    }
};
window.updateCartBadge = state => {
    const total = state.items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
        badge.textContent = String(total); badge.style.display = total > 0 ? '' : 'none';
    });
};
