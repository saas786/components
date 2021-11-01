<template>
    <div>
        <div class="flex space-x-4 items-center select-none">
            <jet-input @click="isPicking = true" type="text" v-model="buttonText" class="w-full select-none cursor-pointer" />
            <div v-if="hasClearedListener && (picked || initial && !isCleared)">
                <svg @click="clear" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-gray-500 hover:text-black cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>

        <jet-modal :show="isPicking" @close="isPicking = false">

            <jet-finder :connect="`picker-${name}`" />

            <jet-list
                :connect="`picker-${name}`"
                :item-display="itemDisplay"
                :url="url"
                :click="pick"
            />
        </jet-modal>
    </div>
</template>

<script>
import JetModal from "@/Jetstream/Modal";
import JetInput from "@/Jetstream/Input";
import JetSecondaryButton from "@/Jetstream/SecondaryButton";
import { JetList, JetFinder } from '@jetstreamkit/components'

export default {
    components: {
        JetModal,
        JetInput,
        JetSecondaryButton,
        JetList,
        JetFinder
    },
    props: {
        url: String,
        initial: String,
        text: {
            type: String,
            default: 'Select'
        },
        itemDisplay: {
            type: String,
            default: 'display'
        }
    },
    data() {
        return {
            picked: null,
            isCleared: false,
            isPicking: false
        }
    },
    computed: {
        buttonText() {
            if(this.isCleared) {
                return this.text
            }

            if(this.picked) {
                return this.picked[this.itemDisplay];
            }

            if(this.initial) {
                return this.initial;
            }

            return this.text;
        },
        clearText() {
            return 'Clear'
        },
        hasClearedListener() {
            return this.$attrs && this.$attrs.onCleared;
        }
    },
    methods: {
        pick(item) {
            this.picked = item;
            this.isPicking = false;
            this.isCleared = false;
            this.$emit('picked', item);
        },
        clear() {
            this.picked = null
            this.isCleared = true;
            this.$emit('cleared')
        }
    }
}
</script>
