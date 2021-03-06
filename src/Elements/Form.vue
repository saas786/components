<template>
    <div data-testid="jet-form">
        <form :action="action" :method="formMethod" class="w-full" @submit.prevent="submit">
            <div v-if="success" class="bg-white p-5 border-b">
                <slot name="success">
                    <p class="text-green-700 font-bold text-center">Success!</p>
                </slot>
            </div>
            <div
                v-if="fieldsFormatted.length"
                class="bg-white p-5 grid grid-cols-12 gap-4"
            >
                <div
                    v-for="(field, index) in fieldsFormatted"
                    :key="field.name"
                    :class="`col-span-${field.span}`"
                    :data-testid="`field-${field.name}`"
                    class="py-2"
                >

                    <div v-if="field.hasOwnProperty('divider')" class="border-b pb-5"/>

                    <slot v-else-if="field.section_title" :value="field.section_title" name="section_title">
                        <div>
                            <p class="flex-1 font-semibold tracking-wider text-gray-700 leading-tight pb-4 border-b">
                                {{ field.section_title }}
                            </p>
                        </div>
                    </slot>

                    <slot
                        v-else
                        :error="getError(field.name)"
                        :errors="errors"
                        :index="index"
                        :name="`field.${field.name}.all`"
                        :values="formValues"
                    >
                        <div>
                            <jet-label
                                :for="field.name"
                                :value="field.label"
                            />

                            <div class="mt-1">
                                <div>
                                    <slot
                                        :index="index"
                                        :name="`field.${field.name}`"
                                        :values="formValues"
                                    >
                                        <component
                                            :is="field.component"
                                            :id="field.name"
                                            v-model="formValues[field.name]"
                                            :class="{ disabled: processing }"
                                            :disabled="processing"
                                            :name="field.name"
                                            :placeholder="field.label"
                                            autocomplete="new-password"
                                            class="w-full"
                                            v-bind="field.props"
                                        />
                                    </slot>

                                    <!-- TODO: errorsFormatted to avoid multiple formats                    -->
                                    <!-- TODO: fields.title.error slot -->
                                    <div v-if="errors && errors.hasOwnProperty(field.name)" data-testid="error">
                                        <JetInputError
                                            v-if="Array.isArray(errors[field.name])"
                                            :message="errors[field.name][0]"
                                        />
                                        <JetInputError
                                            v-else
                                            :message="errors[field.name]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
            <slot name="footer">
                <div class="border-t p-5 flex justify-end rounded-b">
                    <slot
                        v-if="hasCancelListener"
                        :cancel="cancel"
                        name="cancel"
                    >
                        <jet-secondary-button
                            :class="{ 'opacity-25': processing }"
                            :disabled="processing"
                            class="mr-3"
                            data-testid="cancel"
                            @click="cancel"
                        >
                            Cancel
                        </jet-secondary-button>
                    </slot>
                    <slot :submit="submit" name="submit">
                        <jet-button
                            :class="{ 'opacity-25': processing }"
                            :disabled="processing"
                        >
                            {{ formMethod === 'POST' ? 'Create' : 'Update' }}
                        </jet-button>
                    </slot>
                </div>
            </slot>
        </form>
    </div>
    <div
        v-if="false"
        class="col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12"
    ></div>
</template>

<script>
import {Inertia} from '@inertiajs/inertia'
import JetButton from '@/Jetstream/Button.vue';
import JetSecondaryButton from '@/Jetstream/SecondaryButton.vue';
import JetLabel from '@/Jetstream/Label.vue';
import JetInput from '@/Jetstream/Input.vue';
import JetInputError from '@/Jetstream/InputError.vue';
import Connect from '../Mixins/Connect';
import Config from '../Mixins/Config';

export default {
    components: {
        JetLabel,
        JetInput,
        JetButton,
        JetInputError,
        JetSecondaryButton,
    },
    mixins: [Connect, Config],
    props: {
        action: String,
        method: String,
        autocomplete: {
            type: String,
            default: 'new-password',
        },
        handler: {
            type: Object
        },
        exclude: {
            type: Array,
            default: [
                'id',
                'uuid',
                'created_at',
                'updated_at',
                'deleted_at',
                'parent_deleted_at',
            ],
        },
        fields: {
            default: (props) => {
                if (!props.fields && props.values !== undefined) {
                    return Object.keys(props.values).filter(
                        (field) => !props.exclude.includes(field)
                    );
                } else {
                    return [];
                }
            },
        },
        values: Object,
    },
    data() {
        return {
            success: false,
            processing: false,
            formMethod: null,
            formValues: {},
            errors: null,
        };
    },
    beforeMount() {
        this.initFormValues();
        this.initFormMethod();
    },

    methods: {
        initFormMethod() {
            if (this.method) {
                this.formMethod = this.method;
            } else if (this.values && Object.keys(this.values).length !== 0) {
                this.formMethod = 'PUT'
                this.formValues._method = 'put';
            } else {
                this.formMethod = 'POST'
            }
        },
        initFormValues() {
            let values = {};

            if (this.values) {
                values = JSON.parse(JSON.stringify(this.values));
            }

            this.fieldsFormatted.forEach((field) => {
                values[field.name] = values.hasOwnProperty(field.name)
                    ? values[field.name]
                    : field.value;
            });

            this.formValues = values;
        },
        labelize(label) {
            return label.replaceAll('_', ' ')
                .split(' ')
                .map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1)
                }).join(' ')
        },
        defaultFieldFormat(field) {
            let output = {
                name: field,
                label: this.labelize(field),
                component: 'jet-input',
                props: {
                    type: 'text',
                },
                span: '12',
            };

            let fieldConfig = this.config.get(`fields.${field}`, {});

            Object.keys(fieldConfig).forEach((setting) => {
                output[setting] = this.config.get(`fields.${field}.${setting}`);
            });

            return output;
        },
        cancel() {
            this.$emit('cancel');
        },
        submit() {
            this.success = false;
            this.errors = null;
            this.makeRequest()
        },
        reset() {
            if (this.formMethod !== 'post') {
                return;
            }

            Object.keys(this.formValues).forEach(key => {
                this.formValues[key] = null
            })
        },
        makeRequest() {
            let handler = (this.handler) ? this.handler : axios

            handler.request({
                url: this.action,
                data: this.deproxy(this.formValues),
                method: this.formMethod.toLowerCase(),
                headers: {
                    'Show-Redirect-Url': true,
                }
            }).then((response) => {
                this.reset()

                this.$emit('success', response.data);

                if (this.connect) {
                    this.connectChanged('refresh');
                } else {
                    this.$inertia.get(response.data.url)
                }

            }).catch(errors => {
                // 401 means user is not logged in / should be redirected
                // going to the same location will redirect to login
                // but retain the redirect back after logging in
                if (errors.response && errors.response.status === 401) {
                    this.$inertia.get(window.location);
                }

                this.errors = errors.response.data.errors;

                this.$emit('errors', errors.response.data.errors)
            })
        },
        getError(name) {
            // todo: normalize the errors array instead
            if (this.errors && this.errors.hasOwnProperty(name)) {
                if (Array.isArray(this.errors[name])) {
                    return this.errors[name][0];
                } else {
                    return this.errors[name];
                }
            }

            return null;
        },
        deproxy(object) {
            return JSON.parse(JSON.stringify(object));
        },
        addFieldMissing(field) {
            if (field.hasOwnProperty('divider')) {
                return {...field, name: 'divider', span: 12};
            } else if (field.hasOwnProperty('section_title')) {
                return {...field, name: 'section_title', span: 12};
            }

            if (!field.hasOwnProperty('span')) {
                field.span = '12';
            }

            if (!field.hasOwnProperty('label')) {
                field.label = this.labelize(field.name);
            }

            if (!field.hasOwnProperty('component')) {
                field.component = 'jet-input';
            }

            if (
                !field.hasOwnProperty('props') &&
                field.component === 'jet-input'
            ) {
                field.props = {type: 'text'};
            }

            return field;
        }
    },
    computed: {
        hasCancelListener() {
            return this.$attrs && this.$attrs.onCancel;
        },
        fieldsFormatted() {
            if (this.fields.length === 0) {
                return [];
            } else if (typeof this.fields[0] === 'string') {
                return this.fields.map((field) => {
                    return this.defaultFieldFormat(field);
                });
            } else {
                return this.fields.map((field) => {
                    return this.addFieldMissing(field);
                });
            }

        },
    },
};
</script>
