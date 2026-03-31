<script>
    import { cart, globalState } from '../store.svelte.js';
    import { fly } from 'svelte/transition';

    let item = globalState.cartModalSelectedItem;
    export let close;

    let quantity = 1;
    let selectedPortion = null;
    let extras = [];
    let note = '';

    // Example data (you'll pass real later)
    let portions = item.portions || [];
    let availableExtras = item.extras || [];

    $: basePrice = selectedPortion ? selectedPortion.price : item.price;

    $: extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);

    $: total = (basePrice + extrasTotal) * quantity;

    function toggleExtra(extra) {
        if (extras.includes(extra)) {
            extras = extras.filter(e => e !== extra);
        } else {
            extras = [...extras, extra];
        }
    }
    console.log('Add modal');

    function addToCart() {
        console.log('Add');
        cart.add({
            item,
            quantity,
            portion: selectedPortion,
            extras,
            note,
            total
        });

        close();
    }
</script>
<!-- BACKDROP -->
<div class="fixed inset-0 bg-black/40 z-50" onclick={close}></div>

<!-- MODAL -->
 <div class="
        backdrop
        fixed z-50 w-full bg-white shadow-2xl flex flex-col

        /* MOBILE (bottom sheet) */
        bottom-0 left-0 right-0 max-h-[90vh] rounded-t-3xl

        /* DESKTOP (center modal) */
        md:top-1/2 md:left-1/2 md:bottom-auto md:right-auto
        md:w-full md:max-w-lg
        md:max-h-[85vh]
        md:-translate-x-1/2 md:-translate-y-1/2
        md:rounded-3xl
        md:transition-none
    "
    transition:fly={{ y:300 }}
>

    <!-- HEADER -->
    <div class="p-4 border-b flex justify-between items-center">
        <h2 class="font-bold text-lg">{item.name}</h2>
        <button onclick={close}>✕</button>
    </div>

    <!-- CONTENT -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">

        <!-- PORTIONS -->
        {#if portions.length}
            <div>
                <h3 class="font-semibold mb-2">Choose portion</h3>
                <div class="space-y-2">
                    {#each portions as portion}
                        <button
                            class="w-full flex justify-between p-3 rounded-xl border
                            {selectedPortion === portion ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}"
                            onclick={() => selectedPortion = portion}
                        >
                            <span>{portion.name}</span>
                            <span>${portion.price}</span>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- EXTRAS -->
        {#if availableExtras.length}
            <div>
                <h3 class="font-semibold mb-2">Extras</h3>
                <div class="space-y-2">
                    {#each availableExtras as extra}
                        <label class="flex justify-between items-center border rounded-xl p-3 cursor-pointer">
                            <span>{extra.name}</span>
                            <div class="flex items-center gap-3">
                                <span>${extra.price}</span>
                                <input
                                    type="checkbox"
                                    checked={extras.includes(extra)}
                                    onchange={() => toggleExtra(extra)}
                                />
                            </div>
                        </label>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- NOTE -->
        <div>
            <h3 class="font-semibold mb-2">Special request</h3>
            <textarea
                class="w-full rounded-xl border p-3"
                placeholder="e.g. no onions, birthday message..."
                bind:value={note}
            ></textarea>
        </div>

        <!-- QUANTITY -->
        <div class="flex items-center justify-between">
            <span class="font-semibold">Quantity</span>

            <div class="flex items-center gap-3">
                <button
                    class="w-10 h-10 rounded-full bg-gray-100"
                    onclick={() => quantity = Math.max(1, quantity - 1)}
                >-</button>

                <span class="font-bold">{quantity}</span>

                <button
                    class="w-10 h-10 rounded-full bg-gray-100"
                    onclick={() => quantity++}
                >+</button>
            </div>
        </div>

    </div>

    <!-- FOOTER -->
    <div class="p-4 border-t bg-white">
        <button
            type="button"
            class="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 active:scale-95 transition"
            onclick={addToCart}
            disabled={!selectedPortion && portions.length}
        >
            Add to cart • ${total.toFixed(2)}
        </button>
    </div>

</div>