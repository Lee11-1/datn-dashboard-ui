<template>
  <div style="">
    <div style="width:1200px;">
      <div class="text-center"><h5 style="font-weight:700;margin-block-end: 1em">More Information</h5></div>
      <div class="q-pl-xl q-pr-none">
        <div class="col-12 q-pl-sm q-pr-sm">
          <div class="col-12 q-pb-md"><h5 style="font-weight:500;margin-block-start: 0em;margin-block-end: 0.3em">Cancellation Policies</h5></div>
          <div class="col-12 q-pb-md" style="font-weight:500;font-size: 16px;">Select the cancellation policy you want to offer your guests. You can change the configuration at any time without impacting existing bookings - the change will only apply to bookings after the change.</div>
          <div class="col-12 q-pb-md" style="font-weight:600;font-size: 18px;">VNAmazing Recommendation</div>
          <div class="col-12" style="font-weight:500;font-size: 16px;">Safaris & tours with a moderate cancellation policy receive more, typically between 3 and 5 times more bookings compared to operators with a strict cancellation policy. By selecting a more flexible policy, you increase the competitiveness and attractiveness of your business for travelers who have more cautious after the Covid pandemic.</div>
        </div>
        <div class="col-12 q-pl-sm q-pr-sm q-pt-lg row">
          <div class="col-4 q-pr-lg">
            <div class="col-12 q-pb-sm" style="font-weight:500;font-size: 22px;">Moderate</div>
            <div class="col-12">
              If your guest cancels:
            </div>
            <ul>
              <li>At least 60 days before check-in for their safari & tour, Customer will receive a 100% refund (you as the Supplier will keep 0% of the booking).</li>
              <li>Less than 60 days before check-in, Customer will receive no refund (you as the Supplier will keep 100% of the booking).</li>
            </ul>
          </div>
          <div class="col-4 q-pr-lg">
            <div class="col-12 q-pb-sm" style="font-weight:500;font-size: 22px;">Flexible</div>
            <div class="col-12">
              If your guest cancels:
            </div>
            <ul>
              <li>At least 30 days before check-in for their safari & tour, Customer will receive a 100% refund (you as the Supplier will keep 0% of the booking).</li>
              <li>Less than 30 days before check-in, Customer will receive no refund (you as the Supplier will keep 100% of the booking).</li>
            </ul>
          </div>
          <div class="col-4">
            <div class="col-12 q-pb-sm" style="font-weight:500;font-size: 22px;">Strict</div>
            <div class="col-12">
              If your guest cancels:
            </div>
            <ul>
              <li>At least 60 days before check-in for their safari & tour, Customer will receive a 70% refund (you as the Supplier will keep 30% of the booking).</li>
              <li>Less than 60 days before check-in, customer will receive no refund (you as the Supplier will keep 100% of the booking).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import {useRoute} from 'vue-router'

export default {
  setup () {
    const route = useRoute()
    let default_filters = {}

    const tracing_ids = route.query.tracing_ids
    if (tracing_ids) default_filters.tracing_ids = tracing_ids.split(',')

    const types = route.query.types
    if (types) default_filters.types = types.split(',')

    return {
      default_filters
    }
  }
}
</script>
