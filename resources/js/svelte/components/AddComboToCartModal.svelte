<script>
    import { getComboName, getDiscountPrice } from '../functions.js';
    import { cart, globalState } from '../store.svelte.js';
    import { fly } from 'svelte/transition';
    
    // export let close;
    let { type, close, comboItem } = $props();

    let quantity = $state(1);
    let extras = $state([]);
    let preferences = $state([]);
    let note = $state('');

    // Convert everything and adapt



    // we need to calculate prices
    let basePrice = $derived(
        comboItem.price?.price || '0.0'
    )

    let total = $derived(
        basePrice * quantity
    )

    function addToCart() {
        console.log('### ADD TO CART ###')
        console.log( {selectedPortion}, {extras});
        console.log('### /// ADD TO CART ###')
        cart.add({
            comboItem,
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
        <h2 class="font-bold text-lg">{getComboName(comboItem)}</h2>
        <button onclick={close}>✕</button>
    </div>

    <!-- CONTENT -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
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
            disabled={false}
        >
            Add to cart • ${total.toFixed(2)}
        </button>
    </div>

</div>