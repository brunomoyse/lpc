<template>
    <div class="container mx-auto px-2">
        <header>
            <div class="w-10 h-10" ref="animationElement"></div>
            <!-- nav-->
            <nav class="p-6">
                <div class="flex items-center justify-between flex-wrap">
                    <nuxt-link class="flex items-center flex-shrink-0 mr-6 cursor-pointer" to="/">
                        <picture>
                            <source srcSet="/img/lpc_logo_resized.avif" type="image/avif" />
                            <source srcSet="/img/lpc_logo_resized.webp" type="image/webp" />
                            <nuxt-img
                                src="/img/lpc_logo_resized.png"
                                alt="Logo LPC"
                                width="101px"
                                height="32px"
                            />
                        </picture>
                    </nuxt-link>
                    <div>
                        <nuxt-img
                            id="avatarButton"
                            type="button"
                            data-dropdown-toggle="userDropdown"
                            data-dropdown-placement="bottom-start"
                            class="w-10 h-10 rounded-full cursor-pointer"
                            src="/users/avatar_1.png"
                            alt="User dropdown"
                            @click="toggleDropdownMenu"
                        />
                        <!-- Dropdown menu -->
                        <div id="userDropdown" class="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow absolute -translate-x-[135px]" v-if="menu">
                            <div class="py-3 px-4 text-sm text-gray-900">
                                <div>Bruno MOYSE</div>
                                <div class="font-medium truncate">moyse94@gmail.com</div>
                                </div>
                                    <ul class="py-1 text-sm text-gray-700 " aria-labelledby="avatarButton">
                                        <li>
                                            <nuxt-link to="/" class="block py-2 px-4 hover:bg-gray-100" @click="toggleDropdownMenu">Tableau de bord</nuxt-link>
                                        </li>
                                        <li>
                                            <nuxt-link to="/tournaments" class="block py-2 px-4 hover:bg-gray-100" @click="toggleDropdownMenu">Tournois</nuxt-link>
                                        </li>
                                        <li>
                                            <nuxt-link to="/ranking" class="block py-2 px-4 hover:bg-gray-100" @click="toggleDropdownMenu">Classement</nuxt-link>
                                        </li>
                                    </ul>
                                <div class="py-1">
                                <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">Se déconnecter</a>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>

        </header>
        <!-- horizontal line -->
        <hr class="border-1 border-black-400 pb-8">
        <!-- main container -->
        <div class="container mx-auto px-4 mb-24">
            <slot />
        </div>
        <!-- horizontal line -->
        <hr class="border-1 border-black-400 pt-4">
        <footer class="text-center lg:text-left text-xs">
            <div class="text-gray-700 text-center p-4">
                developed by:
                <a class="text-gray-800 hover:text-red-600" target="_blank" href="https://brunomoyse.be/">@bmoyse</a>
            </div>
        </footer>
    </div>
</template>

<script setup>
    import { ref  } from 'vue';

    let menu = ref(false);
    const toggleDropdownMenu = () => {
        menu.value = !menu.value;
    }
</script>
