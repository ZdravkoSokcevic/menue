<script>
    import { globalState } from '../store.svelte.js';

    let { close } = $props();

    const languages = globalState.languages;

    function selectLanguage(language) {
        globalState.setSelectedLanguage(language);
        close();
    }
</script>
{#if globalState.isLanguageModalOpened}
    
<!-- BACKDROP -->
<div
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    onclick={close}
></div>

<!-- MODAL -->
<div
    class="fixed bottom-0 left-0 right-0 z-60 rounded-t-3xl bg-white p-6 shadow-2xl md:left-1/2 md:top-1/2 md:bottom-auto md:w-[480px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl translation-inside"
>
    <div class="mb-6 text-center">
        <h2 class="text-xl font-bold text-gray-900">
            Select Language
        </h2>

        <p class="mt-1 text-sm text-gray-500">
            Choose your preferred language
        </p>
    </div>

    <div class="max-h-[300px] overflow-y-auto overscroll-contain pr-1">
    <div class="grid grid-cols-3 gap-3">
        {#each languages as lang}
            {#if (lang.mandatory || lang.frequent)}
            <button
                type="button"
                onclick={() => selectLanguage(lang)}
                class={`flex flex-col items-center rounded-2xl border p-4 transition-all hover:scale-105
                ${
                    globalState.selectedLanguage.code === lang.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
            >
                <span class="text-4xl">
                    {lang.flag}
                </span>

                <span class="mt-2 text-sm font-medium text-gray-700">
                    {lang.name}
                </span>
            </button>
            {/if}
        {/each}
    </div>
    </div>

    <button
        onclick={close}
        class="mt-6 w-full rounded-2xl border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50"
    >
        Cancel
    </button>
</div>
{/if}