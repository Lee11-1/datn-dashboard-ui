<template>
    <div class="q-pa-lg">
        <div class="row q-mt-lg">
            <div class="row col-4 bg-white" style="border-radius: 4px;">
                <div class="col-8 q-pa-sm">
                    <q-select dense square filled v-model="filter_by_created" :options="options" label="Filter by" />
                    <div class="row q-my-md" v-if="filter_by_created?.value == 'custom'">
                        <div class="col-6 q-px-xs">
                            <date-picker label="Date from"
                                         v-model="created_from"
                                         :rules="rules.created_from"
                                         :options="options_date_from"
                            />
                        </div>
                        <div class="col-6 q-px-xs">
                            <date-picker label="Date to"
                                         v-model="created_to"
                                         :rules="rules.created_to"
                                         :options="options_date_to"
                            />
                        </div>
                    </div>
                </div>
                <div class="col-4 q-pa-sm">
                    <q-btn class="full-width" color="blue-8" no-caps label="Search" @click="list_records()" />
                </div>
            </div>
        </div>
        <div class="row justify-between q-pt-lg">
            <div v-for="(item, index) in statistic_data" :key="index" class="col-3">
                <board :icon="item.icon"
                    :data="item.data.value"
                    :label="item.label" />
            </div>
        </div>
        <div class="row q-pt-lg">
            <div class="row col-md-9 col-12 q-pr-lg">
                <div class="col-md-6 col-12">
                    <q-card class="q-mr-sm bg-white" flat>
                        <q-card-section>
                            <div v-if="processes.loading.in_progress" class="row justify-center">
                                <q-spinner-facebook color="light-blue" size="30px"/>
                            </div>
                            <Bar v-else-if="!processes.loading.in_progress && chart_data.datasets[0].data.length != 0" style="height: 400px; max-height: 400px;" :data="chart_data" :options="chart_options" />
                            <div v-else-if="!processes.loading.in_progress && chart_data.datasets[0].data == 0" class="row justify-center"> No data </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-md-6 col-12">
                    <q-card class="q-ml-md bg-white" flat>
                        <q-card-section>
                            <div v-if="processes.loading.in_progress" class="row justify-center">
                                <q-spinner-facebook color="light-blue" size="30px"/>
                            </div>
                            <Line v-else-if="!processes.loading.in_progress && chart_data.datasets[0].data.length != 0" style="height: 400px; max-height: 400px;" :data="chart_data" :options="chart_options" />
                            <div v-else-if="!processes.loading.in_progress && chart_data.datasets[0].data == 0" class="row justify-center"> No data </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div class="col-md-3 col-12">
                <q-card class="bg-white" flat>
                    <q-card-section>
                        <div v-if="processes.loading.in_progress" class="row justify-center">
                            <q-spinner-facebook color="light-blue" size="30px"/>
                        </div>
                        <Doughnut v-else-if="!processes.loading.in_progress && chart_data.datasets[0].data.length != 0" style="height: 400px; max-height: 400px;" :data="doughnut_chart_data" :options="chart_options" />
                        <div v-else-if="!processes.loading.in_progress && chart_data.datasets[0].data == 0" class="row justify-center"> No data </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>
<script>
import { onBeforeMount, ref, reactive } from 'vue'
import {use_api} from 'src/composibles/api'
import Board from './board'
import DatePicker from 'components/common/date-picker'
import { Bar, Line, Doughnut } from 'vue-chartjs'
import { get_now, convert_date_to_string } from 'src/utils'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)
export default {
    components: {
        Board,
        Bar,
        Line,
        Doughnut,
        DatePicker
    },
    data() {
        return {
            chart_options: {
                responsive: true,
                maintainAspectRatio: false
            },
            rules: {
                created_from: [
                    v => (!!v && !!v.trim()) || 'Required',

                ],
                created_to: [
                    v => (!!v && !!v.trim()) || 'Required',
                ]
            }
        }
    },
    setup () {
        const api = use_api()
        const processes = reactive({
            loading: {
                in_progress: false
            }
        })
        const filter_by_created = ref('')
        const created_from = ref(null)
        const created_to = ref(null)
        const options = reactive([
            {
                label: 'Today',
                value: '0'
            },
            {
                label: 'Yesterday',
                value: '1'
            },
            {
                label: 'Last 3 days',
                value: '3'
            },
            {
                label: 'Last 7 days',
                value: '7'
            },
            {
                label: 'Last 30 days',
                value: '30'
            },
            {
                label: 'Custom range',
                value: 'custom'
            }
        ])
        const custom_range = ref(false)
        const total_amount = ref()
        const booking = ref()
        const client = ref()
        const line_year_month = ref([])
        const line_revenue = ref([])
        const chart_data = ref({})
        const doughnut_chart_data = ref({})
        const statistic_data = [
            {
                'icon': 'https://drxp4nsypg3ox.cloudfront.net/cms/vnzamazing-tour/images/b2b_dollar_sign.png',
                'data': total_amount,
                'label': 'Revenue ($)'
            },
            {
                'icon': 'https://drxp4nsypg3ox.cloudfront.net/cms/vnzamazing-tour/images/b2b_sale_sign.png',
                'data': booking,
                'label': 'Number of Bookings'
            },
            {
                'icon': 'https://drxp4nsypg3ox.cloudfront.net/cms/vnzamazing-tour/images/b2b_client_sign.png',
                'data': client,
                'label': 'Number of Products'
            }
        ]

        const list_records = async () => {
            let process = processes.loading
            process.in_progress = true

            let payload = {}
            if (filter_by_created.value)
                payload.created_at = filter_by_created.value.value
            if (created_from.value)
                payload.created_from = created_from.value
            if (created_to.value)
                payload.created_to = created_to.value

            // MOCK DATA - Replace with actual API call when data is available
            const mockData = {
                total_amount: 45250,
                booking: 128,
                client: 342,
                chart_data: [
                    { month: 'Jan', year: 2024, amount: 5000 },
                    { month: 'Feb', year: 2024, amount: 6500 },
                    { month: 'Mar', year: 2024, amount: 4800 },
                    { month: 'Apr', year: 2024, amount: 7200 },
                    { month: 'May', year: 2024, amount: 8100 },
                    { month: 'Jun', year: 2024, amount: 5650 }
                ]
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            const response = { status: 200, data: mockData }

            if (response.status === 200) {
                total_amount.value = response.data.total_amount
                booking.value = response.data.booking
                client.value = response.data.client

                line_year_month.value = []
                line_revenue.value = []
                response.data.chart_data.forEach(i => {
                    line_year_month.value.push(`${i.month}, ${i.year}`)
                    line_revenue.value.push(i.amount)
                })

                chart_data.value.labels = line_year_month.value
                chart_data.value.datasets = [{
                        label: filter_by_created.value ? `Revenue by ${filter_by_created.value.label}` : 'Revenue by Month',
                        backgroundColor: '#1976D2',
                        data: line_revenue.value
                }]
                doughnut_chart_data.value.labels = line_year_month.value
                doughnut_chart_data.value.datasets = [{
                    label: filter_by_created.value ? `Revenue by ${filter_by_created.value.label}` : 'Revenue by Month',
                    backgroundColor: ['#1976D2', '#0c63cc', '#e861cb', '#d4fa2a', '#c22929', '#5de8ba'],
                    data: line_revenue.value
                }]
                process.in_progress = false
            }
        }
        onBeforeMount(() => {
            list_records()
        })

        return {
            processes,
            statistic_data,
            filter_by_created,
            total_amount,
            booking,
            client,
            line_year_month,
            line_revenue,
            chart_data,
            doughnut_chart_data,
            options,
            custom_range,
            created_from,
            created_to,
            list_records,
            options_date_from(date) {
                let now = convert_date_to_string(get_now(), 'YYYY/MM/DD')
                return date <= now
            },
            options_date_to(date) {
                if (created_from.value) {
                    let now = convert_date_to_string(get_now(), 'YYYY/MM/DD')
                    let date_from = created_from.value.split('T')[0]
                    date_from = date_from.replaceAll('-', '/')
                    return date > date_from && date <= now
                }
            }
        }
    }
}
</script>
