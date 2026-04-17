<script>
    import { cart } from '../store.svelte.js';
    import { fly, fade } from 'svelte/transition';

    let { closeCart } = $props();
</script>

<div
    transition:fade={{ duration: 150 }}
    onclick={closeCart}
    class="fixed inset-0 z-60 bg-black/30"
></div>

<div
    transition:fly={{ x: 320, duration: 220, opacity: 1 }}
    class="fixed right-0 top-0 z-70 flex h-full w-full max-w-sm flex-col border-l border-gray-200 bg-white shadow-lg"
>
    <div class="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-900">Your Order</h2>
        <button
            onclick={closeCart}
            class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
            ✕
        </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 pt-0">
        {#each cart.items as item (item.id)}
            <div class="pt-6 group mb-4 flex items-center gap-4 border-t border-gray-200">
                <img
                    src="/storage/{item.picture}"
                    alt={item.name}
                    class="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover"
                    loading="lazy"
                    decoding="async"
                />

                <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <div class="mt-2 flex flex-wrap gap-2">
                                <h4 class="truncate font-bold text-gray-900">{item.name}</h4>
                                <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                                    Portion: {item.portionSize}
                                </span>
                                <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    Qty: {item.quantity}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- DESKTOP REMOVE BTN -->
                <button
                    onclick={() => cart.remove(item.id)}
                    class="text-xs font-bold uppercase tracking-tight text-red-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600 lg:block sm:hidden"
                >
                    Remove
                </button>

                <!-- MOBILE REMOVE BTN -->
                <button
                    onclick={() => cart.remove(item.id)}
                    class="text-xs font-bold uppercase tracking-tight text-red-400 lg:hidden sm:block"
                >
                    Remove
                </button>
            </div>
            <div class="mt-3 flex items-end justify-between">
                <div class="text-sm text-gray-500">
                    ${item.selectedPortion.price} each
                </div>

                <div class="text-right">
                    <p class="text-sm text-gray-400">
                        {item.quantity} × ${item.selectedPortion.price}
                    </p>
                    <p class="text-base font-extrabold text-gray-900">
                        ${(item.selectedPortion.price * item.quantity).toFixed(2)}
                    </p>
                </div>
            </div>
            {#if item.extras && item.extras.length}
                <div class="mt-3">
                    <h6 class="text-sm text-gray-500 mt-4">Extras:</h6>
                    {#each item.extras as extra}
                        <div class="flex items-end justify-between">
                            <div class="text-sm text-gray-500">
                                ${extra.prices[0].price}
                            </div>

                            <div class="text-right">
                                <p class="text-sm text-gray-400">
                                    {item.quantity} × ${extra.prices[0].price}
                                </p>
                                <p class="text-base font-extrabold text-gray-900">
                                    ${(extra.prices[0].price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
            <!-- TOTAL FOR ITEM -->
            <div class="mt-3 flex items-end justify-between border-t border-gray-200">
                <div class="text-sm text-bold-500">
                    TOTAL: 
                </div>

                <div class="text-right">
                    <p class="text-sm text-gray-400">
                        
                    </p>
                    <p class="text-base font-extrabold text-gray-900">
                        {cart.totalSingle(item).toFixed(2)}
                    </p>
                </div>
            </div>

        {:else}
            <div class="flex h-full flex-col items-center justify-center text-center">
                <span class="mb-4 text-4xl">🛒</span>
                <p class="italic text-gray-400">Your cart is empty.</p>
                <button
                    onclick={closeCart}
                    class="mt-4 text-sm font-bold text-blue-600 hover:underline"
                >
                    Continue Shopping
                </button>
            </div>
        {/each}
    </div>

    {#if cart.items && cart.items.length > 0}
        <div class="border-t border-gray-100 bg-gray-50 p-6">
            <div class="mb-6 flex items-end justify-between">
                <span class="text-sm font-bold uppercase tracking-widest text-gray-500">Total</span>
                <span class="text-3xl font-black text-gray-900">${cart.total.toFixed(2)}</span>
            </div>

            <a
                href="/cart" {...{'wire:navigate': true }}
                class="block w-full rounded-2xl bg-blue-600 py-4 text-center font-bold text-white transition-transform transition-colors hover:bg-blue-700 active:scale-95"
                // onclick|preventDefault={() => cart.add(item)}
            >
                View cart
            </a>
        </div>
    {/if}
</div>