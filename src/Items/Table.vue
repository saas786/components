<template>
    <div class="overflow-auto" data-testid="jet-table">
        <div v-if="items.length > 0">
            <table cellpadding="0" cellspacing="0" class="whitespace-nowrap w-full">
                <thead>
                <tr class="text-left font-bold border-b">
                    <th v-for="th in cellsFormatted" class="px-5 py-3">
                        <slot :name="`th.${th.name}`">
                <span class="capitalize">
                  {{ th.display }}
                </span>
                        </slot>
                    </th>
                    <th v-if="$slots['tr-last']"/>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                <tr
                    v-for="(item, index) in items"
                    :key="item.id"
                    :class="{ 'cursor-pointer hover:bg-gray-50': this.click }"
                >
                    <td
                        v-for="cell in cellsFormatted"
                        class="px-6 py-4"
                        @click="visit(item)"
                        :data-testid="`td-${cell.testid}`"
                    >
                        <slot
                            :index="index"
                            :item="item"
                            :name="`td.${cell.name}`"
                            :value="item[cell.name]"
                        >
                            {{ data_get(item, cell.path) }}
                        </slot>
                    </td>
                    <td v-if="$slots['td-last']">
                        <div class="flex justify-end">
                            <slot :row="item" name="td-last"/>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <jet-pagination :connect="connect" :links="links" class="p-5 border-t"/>
        </div>
        <div v-else>
            <slot name="empty">
                <jet-empty/>
            </slot>
        </div>
    </div>
</template>

<script>
import Items from '../Mixins/Items';

export default {
    mixins: [Items],
    data() {
        return {
            currentUrl: null,
            cellsFormatted: [],
        };
    },
    beforeMount() {
        let output = [];

        this.cells.forEach((cell) => {
            let column = cell;
            let display = cell;

            if (cell.includes('.')) {
                display = cell.split('.')[0];
                column = cell.split('.')[1];
            }

            output.push({
                path: cell,
                name: column,
                testid: display,
                display: display.replace('_', ' '),
            });
        });

        this.cellsFormatted = output;
    },
    methods: {
        data_get(obj, key) {
            let target = obj;

            if (!key.includes('.')) {
                if (obj.hasOwnProperty(key)) {
                    return obj[key];
                }

                return null;
            }

            key.split('.').forEach((segment) => {
                if (target.hasOwnProperty(segment)) {
                    target = target[segment];
                }
            });

            return target;
        },
    },
};
</script>
