<template>
    <div>
        <div class="text-teal-500">
            <NuxtLink to="/tournaments">Tous les tournois</NuxtLink>
            <br/>
            <NuxtLink to="/ranking">Classement</NuxtLink>
            <br>
            <div @click="loginUser">
                <p>test login</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {Ref} from "vue";
import {User} from "~/composables/types";




</script>
