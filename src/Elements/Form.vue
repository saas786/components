<template>
    <div>
        <form @submit.prevent="submit" class="w-full">
            <div v-if="success" class="bg-white p-5 border-b">
                <slot name="success">
                    <p class="text-green-700 font-bold text-center">Success!</p>
                </slot>
            </div>
            <div class="bg-white p-5">
                <div v-for="(input, index) in fields" :key="input" class="py-2">
                    <slot
                        :name="`field.${input}.all`"
                        :errors="errors"
                        :index="index"
                        :form="form"
                    >
                        <div>
                            <label :for="input" class="capitalize block text-sm font-medium text-gray-700">
                                {{ input.replace('_', ' ') }}
                            </label>
                            <div class="mt-1">
                                <slot
                                    :name="`field.${input}`"
                                    :index="index"
                                    :form="form"
                                >
                                    <input
                                        type="text"
                                        :name="input"
                                        :id="input"
                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        :placeholder="input"
                                        v-model="form[input]"
                                        :disabled="form.processing"
                                        :class="{ 'disabled': form.processing }"
                                    />
                                </slot>
                                <p v-if="errors && errors.hasOwnProperty(input)" class="mt-2 text-sm text-red-600">
                                    {{ errors[input] }}
                                </p>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
            <div class="bg-white border-t p-5 flex justify-end rounded-b">
                <slot name="submit">
                    <jet-button :disabled="form.processing" :class="{ 'opacity-25': form.processing }">
                        {{ formMethod === 'POST' ? 'Create' : 'Update' }}
                    </jet-button>
                </slot>
            </div>
        </form>
    </div>
</template>

<script>
import JetButton from '@/Jetstream/Button';

export default {
    components: {JetButton},
    props: {
        action: String,
        method: String,
        fields: Array,
        values: Object,
    },
    data() {
        return {
            form: null,
            success: false,
            formMethod: null,
            errors: null,
        }
    },
    beforeMount() {
        this.formMethod = (
            this.values
            && Object.keys(this.values).length !== 0
            && ! this.method
        ) ? 'PUT' : 'POST'

        let formValues = this.values ?? {}

        if(Object.keys(formValues).length === 0) {
            this.fields.forEach(field => {
                formValues[field] = null
            })
        }

        this.form = this.$inertia.form(formValues)

        if(this.formMethod === 'PUT') {
            this.form._method = 'put'
        }
    },
    methods: {
        submit() {
            this.success = false;
            this.errors = null;

            this.form.submit(this.formMethod.toLowerCase(), this.action, {
                preserveScroll: true,
                onError: () => {
                    this.errors = this.$page.props.errors
                },
                onSuccess: () => {
                    this.success = true;
                    this.form.reset()
                },
            })
        }
    }
}
</script>
