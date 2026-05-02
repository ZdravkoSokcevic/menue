<script>
    import { cart, globalState } from '../store.svelte.js';
    import { fly } from 'svelte/transition';

    let item = globalState.cartModalSelectedItem;
    export let close;

    let quantity = 1;
    let selectedPortion = item.portions[0];
    let extras = [];
    let preferences = [];
    let note = '';

    // Example data (you'll pass real later)
    let portions = item.portions || [];
    let availableExtras = item.extras || [];
    let availablePreferences = item.preferences || [];

    $: basePrice = selectedPortion ? selectedPortion.price : item.portions[0].price;

    $: extrasTotal = extras.reduce((sum, e) => sum + (e && e.prices[0] && e.prices[0].price && !isNaN(e.prices[0].price)) ? e.prices[0].price : 0, 0);

    $: total = (basePrice + extrasTotal) * quantity;

    function toggleExtra(extra) {
        if (extras.includes(extra)) {
            extras = extras.filter(e => e !== extra);
        } else {
            extras = [...extras, extra];
        }
    }

    function togglePreference(preference) {
        if(preferences.includes(preference)) {
            preferences = preferences.filter(e => e !== preference);
        }else preferences = [...preferences, preference]
    }

    function addToCart() {
        console.log('### ADD TO CART ###')
        console.log({item}, {selectedPortion}, {extras});
        console.log('### /// ADD TO CART ###')
        cart.add({
            item,
            quantity,
            selectedPortion: selectedPortion,
            extras: extras,
            preferences: preferences,
            note,
            total
        });

        quantity = 0;

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

        <!-- PREFERENCES -->
        {#if availablePreferences.length}
            <div>
                <h3 class="font-semibold mb-2">Preferences</h3>
                <div class="space-y-2">
                    {#each availablePreferences as preference}
                        <label class="flex justify-between items-center border rounded-xl p-3 cursor-pointer">
                            <span>{preference.name}</span>
                            <div class="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={preferences.includes(preference)}
                                    onchange={() => togglePreference(preference)}
                                />
                            </div>
                        </label>
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
                                <span>${(extra && extra.prices && extra.prices[0] && extra.prices[0].price) ? extra.prices[0].price : 0}</span>
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

        <!-- PRICES -->
        <div class="flex flex-col border-t pt-4">
            {#if selectedPortion}
                <div class="w-full flex justify-between items-center">

                    <span class="font-semibold">{selectedPortion.name}</span>
                    
                    <div class="flex items-center gap-3">
                        <span class="price">${selectedPortion.price}</span>
                    </div>
                </div>
            {/if}
            {#each preferences as preference}
                <div class="w-full flex justify-between items-center">
                <span class="font-semibold">{preference.name}</span>
                
                <div class="flex items-center gap-3">
                    <span class="price">$0</span>
                </div>
                </div>
            {/each}
            {#each extras as extra}
                <div class="w-full flex justify-between items-center">
                <span class="font-semibold">{extra.name}</span>
                
                <div class="flex items-center gap-3">
                    <span class="price">${(extra && extra.prices && extra.prices[0] && extra.prices[0].price) ? extra.prices[0].price : 0}</span>
                </div>
                </div>
            {/each}
            <!-- TOTAL PRICE -->
            <div class="w-full flex justify-between items-center border-t">
                <span class="font-semibold">TOTAL:</span>

                <div class="flex items-center gap-3">
                    <span class="price">${(!isNaN(total)) ? total : 0}</span>
                </div>
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