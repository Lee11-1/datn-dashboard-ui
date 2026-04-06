export default function () {
  const date_format = 'DD-MM-YYYY'
  const time_format = 'HH:mm'
  return {
    date_format: date_format,
    time_format: time_format,
    datetime_format: `${date_format} ${time_format}`,
    app_statuses: [],
    booking_scenarios: ['success', 'in-progress', 'cancel']
  }
}
