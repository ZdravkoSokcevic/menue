<script>
    import { cart } from '../store.svelte.js';
    import Order from "../api/Order.js"

    async function createOrder(e) {
        e.preventDefault();
        e.stopPropagation();
        let items = cart.items;
        const dataItems = items.map((item) => {
            // extract extras ids
            // extract preferences ids
            let extrasIds = [];
            let preferencesIds = [];
            item.extras.map(extra => extrasIds.push(extra.id));
            item.preferences.map(preference => preferencesIds.push(preference.id));
            return {
                menu_id: item.id,
                portion_id: item.selectedPortion.id,
                quantity: item.quantity,
                extras: extrasIds,
                preferences: preferencesIds,
                note: item.note
            }
        });
        let data = {
            items: dataItems 
        }

        let response = await Order.create(data);
        if(response && response.success && response.data) {
            alert('Order created');
        }

    }
</script>

<div class="mx-auto max-w-5xl p-4 md:p-8">

    <h1 class="mb-6 text-2xl font-bold">Your Cart</h1>

    {#if cart.items.length > 0}

        <div class="space-y-6">

            {#each cart.items as item (item.id)}
                <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                    <div class="flex gap-4">

                        <!-- IMAGE -->
                        <img
                            src="/storage/{item.picture}"
                            class="h-24 w-24 rounded-xl object-cover"
                            alt={item.name}
                        />

                        <!-- CONTENT -->
                        <div class="flex-1">

                            <div class="flex justify-between">
                                <h3 class="font-bold text-lg">{item.name}</h3>

                                <button
                                    onclick={() => cart.remove(item.id)}
                                    class="text-red-500 text-sm font-bold"
                                >
                                    Remove
                                </button>
                            </div>

                            <div class="mt-2 flex flex-wrap gap-2 text-sm">
                                <span class="bg-gray-100 px-2 py-1 rounded-full">
                                    Portion: {item.portionSize}
                                </span>

                            <div class="flex items-center gap-2">
                                <button onclick={() => cart.decrease(item.id)}>-</button>
                                <span>{item.quantity}</span>
                                <button onclick={() => cart.increase(item.id)}>+</button>
                            </div>
                            </div>

                            <!-- EXTRAS -->
                            {#if item.extras?.length}
                                <div class="mt-3 text-sm text-gray-500">
                                    Extras:
                                    {#each item.extras as extra}
                                        <div class="flex justify-between">
                                            <span>{extra.name}</span>
                                            <span>
                                                ${(extra.prices[0].price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    {/each}
                                </div>
                            {/if}

                        </div>

                    </div>

                    <!-- PRICE SECTION -->
                    <div class="mt-4 flex justify-between border-t pt-3">

                        <div class="text-sm text-gray-500">
                            {item.quantity} × ${item.selectedPortion.price}
                        </div>

                        <div class="font-bold">
                            ${cart.totalSingle(item).toFixed(2)}
                        </div>

                    </div>

                </div>
            {/each}

        </div>

        <!-- TOTAL -->
        <div class="mt-8 rounded-2xl border bg-gray-50 p-6">

            <div class="flex justify-between mb-4">
                <span class="text-gray-500 font-semibold">Total</span>
                <span class="text-2xl font-bold">${cart.total.toFixed(2)}</span>
            </div>

            <button
                href="#"
                role="button"
                {...{'wire:navigate': true }}
                onclick={createOrder}
                class="block w-full rounded-2xl bg-blue-600 py-4 text-center font-bold text-white hover:bg-blue-700 active:scale-95 transition"
            >
                Order
            </button>

        </div>

    {:else}

        <!-- EMPTY STATE -->
        <div class="flex flex-col items-center justify-center text-center py-20">
            <span class="text-5xl mb-4">🛒</span>
            <p class="text-gray-400 italic">Your cart is empty</p>

            <a
                href="/"
                {...{'wire:navigate': true }}
                class="mt-4 text-blue-600 font-bold"
            >
                Go back to menu
            </a>
        </div>

    {/if}

</div>