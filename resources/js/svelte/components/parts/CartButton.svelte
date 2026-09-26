<!-- FloatingCartButton.svelte -->
<script>
    import { cart, globalState } from "@/svelte/store.svelte";

    // Adjust these to match your actual store shape
    const cartCount = $derived(Array.isArray(cart.items) ? cart?.items.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0 : 0);
    const cartTotal = $derived(
        cart?.total.toFixed(2)
    );

    let prevCount = $state(0);
    let bump = $state(false);

    $effect(() => {
        if (cartCount > prevCount) {
            bump = true;
            setTimeout(() => (bump = false), 250);
        }
        prevCount = cartCount;
    });
</script>
{#if cartCount > 0}
    <div class="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-none">
        <a
            href={'/cart/' + globalState.code} {...{'wire:navigate': true }}
            class="pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl bg-blue-600 px-4 py-3.5 text-white shadow-xl transition-transform duration-150 hover:bg-blue-700 active:scale-95 {bump ? 'scale-105' : ''}"
            // onclick|preventDefault={() => cart.add(item)}
            onclick = {() => { 
                globalState.setCurrentPage('cart')
            }}
        >
            <span class="flex items-center gap-2.5">
                <span class="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.716 2.598-7.22a.75.75 0 0 0-.722-.958H5.324m2.176 8.178L5.106 5.272M4.5 20.25a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Zm14.25 0a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Z" />
                    </svg>
                    <span class="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-blue-600">
                        {cartCount}
                    </span>
                </span>
                <span class="text-sm font-semibold">View order</span>
            </span>

            <span class="text-sm font-extrabold">${cart?.total?.toFixed(2)}</span>
        </a>
    </div>
{/if}