<template>
    <div>
        <form @submit.prevent="submit" class="w-full">
            <div v-if="success" class="bg-white p-5 border-b">
                <slot name="success">
                    <p class="text-green-700 font-bold text-center">Success!</p>
                </slot>
            </div>
            <div v-if="fieldsFormatted.length" class="bg-white p-5 grid grid-cols-12 gap-4">
                <div v-for="(field, index) in fieldsFormatted" :key="field.name" class="py-2" :class="`col-span-${field.span}`">
                    <div v-if="field.divider" class="border-b pb-5"></div>
                    <slot v-else-if="field.section_title" name="section_title">
                        <p class="flex-1 font-semibold tracking-wider text-gray-700 leading-tight pb-4 border-b">
                            {{ field.section_title }}
                        </p>
                    </slot>
                    <slot
                        v-else
                        :name="`field.${field.name}.all`"
                        :errors="errors"
                        :index="index"
                        :form="form"
                    >
                        <div>
                            <jet-label
                                :for="field.name"
                                class="capitalize"
                                :value="field.label"
                            />

                            <div class="mt-1">
                                <div>
                                    <slot
                                        :name="`field.${field.name}`"
                                        :index="index"
                                        :form="form"
                                    >
                                        <component
                                            :is="field.component"
                                            :id="field.name"
                                            type="text"
                                            :name="field.name"
                                            :placeholder="field.label"
                                            class="w-full"
                                            v-model="form[field.name]"
                                            :disabled="form.processing"
                                            autocomplete="new-password"
                                            :class="{ 'disabled': form.processing }"
                                            v-bind="field.props"
                                        />
                                    </slot>

                                    <p v-if="errors && errors.hasOwnProperty(field.name)" class="pt-2">
                                        <JetInputError :message="errors[field.name][0]" v-if="Array.isArray(errors[field.name])" />
                                        <JetInputError :message="errors[field.name]" v-else />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
            <slot name="footer">
                <div class="border-t p-5 flex justify-end rounded-b">
                    <slot name="cancel" :form="form" :cancel="cancel" v-if="hasCancelListener">
                        <jet-secondary-button class="mr-3" @click="cancel" :disabled="form.processing" :class="{ 'opacity-25': form.processing }">
                            Cancel
                        </jet-secondary-button>
                    </slot>
                    <slot name="submit" :form="form" :submit="submit">
                        <jet-button :disabled="form.processing" :class="{ 'opacity-25': form.processing }">
                            {{ formMethod === 'POST' ? 'Create' : 'Update' }}
                        </jet-button>
                    </slot>
                </div>
            </slot>
        </form>
    </div>
    <div v-if="false" class="col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12"></div>
</template>

<style scoped>
::-webkit-input-placeholder {
    text-transform: capitalize;
}

:-moz-placeholder {
    text-transform: capitalize;
}

::-moz-placeholder {
    text-transform: capitalize;
}

:-ms-input-placeholder {
    text-transform: capitalize;
}
</style>

<script>
import JetButton from '@/Jetstream/Button';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';
import JetLabel from '@/Jetstream/Label';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import Connect from '../Mixins/Connect';

export default {
    components: {
        JetLabel,
        JetInput,
        JetButton,
        JetInputError,
        JetSecondaryButton
    },
    mixins: [Connect],
    props: {
        action: String,
        method: String,
        autocomplete: {
            type: String,
            default: 'new-password'
        },
        fields: {
            default: () => []
        },
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
        if(this.method) {
            this.formMethod = this.method
        } else {
            this.formMethod = (
                this.values
                && Object.keys(this.values).length !== 0
                && ! this.method
            ) ? 'PUT' : 'POST'
        }

        let formValues = this.values ?? {}

        if(Object.keys(formValues).length === 0) {
            this.fieldsFormatted.forEach(field => {
                formValues[field.name] = null
            })
        }

        if(this.connect) {
            this.form = formValues
        } else {
            this.form = this.$inertia.form(formValues)
        }

        if(this.formMethod === 'PUT') {
            this.form._method = 'put'
        }
    },
    methods: {
        defaultFieldFormat(field) {
            return {
                name: field,
                label: field.replaceAll('_', ' '),
                component: 'jet-input',
                props: {},
                span: '12',
            }
        },
        cancel() {
            this.$emit('canceled')
        },
        submit() {
            this.success = false;
            this.errors = null;

            if(this.connect) {
                axios({
                    method: this.formMethod.toLowerCase(),
                    url: this.action,
                    data: this.form,
                }).then(response => {
                    this.connectChanged('refresh')
                    this.$emit('success', response.data)
                }).catch(errors => {
                    if (errors.response && errors.response.status === 401) {
                        this.$inertia.get(window.location)
                    }

                    this.errors = errors.response.data.errors;

                })
            } else {
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
        },
    },
    computed: {
        hasCancelListener() {
            return this.$attrs && this.$attrs.onCanceled;
        },
        fieldsFormatted() {
            let formatted = [];

            if(this.fields.length === 0) {
                return [];
            }

            if(typeof this.fields[0] === 'string') {
                this.fields.forEach(field => {
                    formatted.push(
                        this.defaultFieldFormat(field)
                    )
                })

                return formatted;
            }

            this.fields.forEach(field => {
                let newField = field;

                if(! newField.hasOwnProperty('span')) {
                    newField.span = '12'
                }

                if(! newField.hasOwnProperty('component')) {
                    newField.component = 'jet-input'
                }

                formatted.push(newField)
            })

            return formatted;
        }
    }
}
</script>
