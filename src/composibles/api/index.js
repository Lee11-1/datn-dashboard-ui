import axios from 'axios'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

class RequestHandler {
  constructor (base_url) {
    this.axios = axios.create({
      baseURL: base_url,
      withCredentials: true
    })
  }

  make_request_data ({
                       method,
                       payload,
                       headers = null,
                       progress_handler = null
                     }) {
    if (!headers) {
      headers = {}
    }
    if (method === 'get' || method === 'delete') {
      const params = {}
      if (payload) {
        Object.keys(payload).forEach(k => {
          let v = payload[k]
          if (Array.isArray(v)) v = v.join(',')
          params[k] = v
        })
      }
      return [{
        headers: headers,
        params: params
      }]
    } else if (method === 'post' || method === 'put' || method === 'patch') {
      const options = {}
      if (typeof progress_handler === 'function') options['onUploadProgress'] = progress_handler
      return [
        payload,
        {headers: headers, ...options}
      ]
    }
  }

  async do_request ({url, method, payload, headers, progress_handler}) {
    if (!payload || !(payload instanceof Object)) payload = {}

    const request_data = this.make_request_data({
      method,
      payload,
      headers,
      progress_handler
    })

    const result = {
      status: 200,
      data: null,
      error: null,
      message: null
    }

    try {
      const response = await this.axios[method](url, ...request_data)
      result.status = response.status
      result.data = response.data
    } catch (error) {
      const response = error.response || {}
      result.status = response.status || 500
      result.data = response.data || {error: 'UnknownError'}
    }
    return result
  }
}

class Api {
  constructor ({store, router}) {
    console.log(process.env.API_URL || '----test----api---')
    this.request_handler = new RequestHandler(
      process.env.API_URL
    )
    this.store = store
    this.router = router
  }

  async do_request (endpoint, {method, payload, headers, progress_handler}) {
    let final_headers = {
      Authorization: 'Bearer ' + this.store.state.Auth.access_token,
    }
    if (headers) {
      Object.assign(final_headers, headers)
    }

    let request_params = {
      url: endpoint,
      headers: final_headers,
      method,
      payload,
      progress_handler
    }
    const response = await this.request_handler.do_request(request_params)
    if (response.status === 401) {
      this.store.commit('Auth/signed_out')
      this.router.push('/auth')
    }
    return response
  }

  authenticate ({email, password}) {

    const payload = {
      email,
      password,
      scope_type: 'System'
    }

    return this.do_request(
      '/auth',
      {
        method: 'post',
        payload,
      }
    )
  }

  get_context () {
    return this.do_request(
      '/context',
      {
        method: 'get',
      }
    )
  }

  sync_app (payload) {
    return this.do_request(
      '/apps/sync',
      {
        method: 'post',
        payload
      }
    )
  }

  get_app (payload) {
    return this.do_request(
      '/apps',
      {
        method: 'get',
        payload
      }
    )
  }

  update_app (payload) {
    return this.do_request(
      '/apps',
      {
        method: 'patch',
        payload
      }
    )
  }

  delete_app (payload) {
    return this.do_request(
      '/apps',
      {
        method: 'delete',
        payload
      }
    )
  }

  list_apps (payload) {
    return this.do_request(
      '/apps/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_app_versions (payload) {
    return this.do_request(
      '/apps/versions/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_products (payload) {
    return this.do_request(
      '/products/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_suppliers (payload) {
    return this.do_request(
      '/suppliers',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_docker_images (payload) {
    return this.do_request(
      '/docker-images/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_version (payload) {
    return this.do_request(
      '/apps/versions',
      {
        method: 'post',
        payload,
      }
    )

  }

  get_version (payload) {
    return this.do_request(
      '/apps/versions',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_version (payload) {
    return this.do_request(
      '/apps/versions',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_currencies (payload) {
    return this.do_request(
      '/currencies/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  remove_currencies (payload) {
    return this.do_request(
      '/currencies',
      {
        method: 'delete',
        payload,
      }
    )
  }

  create_currency (payload) {
    return this.do_request(
      '/currencies',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_currency (payload) {
    return this.do_request(
      '/currencies',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_currency_conversions (payload) {
    return this.do_request(
      '/currencies/conversions',
      {
        method: 'get',
        payload,
      }
    )
  }

  remove_currency_conversions (payload) {
    return this.do_request(
      '/currencies/conversions',
      {
        method: 'delete',
        payload,
      }
    )
  }

  create_currency_conversion (payload) {
    return this.do_request(
      '/currencies/conversions',
      {
        method: 'post',
        payload,
      }
    )
  }

  currency_automatic_conversion (payload) {
    return this.do_request(
      '/currencies/auto-conversion',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_currency_conversion (payload) {
    return this.do_request(
      '/currencies/conversions',
      {
        method: 'patch',
        payload,
      }
    )
  }

  update_supplier (payload) {
    return this.do_request(
      '/suppliers',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_supplier (payload) {
    return this.do_request(
      '/suppliers',
      {
        method: 'post',
        payload,
      }
    )
  }

  delete_suppliers (payload) {
    return this.do_request(
      '/suppliers',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_supplier_switches (payload) {
    return this.do_request(
      '/suppliers/switches',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_supplier_switch (payload) {
    return this.do_request(
      '/suppliers/switches',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_supplier_switch (payload) {
    return this.do_request(
      '/suppliers/switches',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_supplier_switches (payload) {
    return this.do_request(
      '/suppliers/switches',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_languages (payload) {
    return this.do_request(
      '/languages/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_language (payload) {
    return this.do_request(
      '/languages',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_language (payload) {
    return this.do_request(
      '/languages',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_language_key (payload) {
    return this.do_request(
      '/languages/update_key',
      {
        method: 'patch',
        payload,
      }
    )
  }

  update_language (payload) {
    return this.do_request(
      '/languages',
      {
        method: 'patch',
        payload,
      }
    )
  }

  remove_language (payload) {
    return this.do_request(
      '/languages',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_date_formats (payload) {
    return this.do_request(
      '/date-formats/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_time_formats (payload) {
    return this.do_request(
      '/time-formats/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  product_systems () {
    return this.do_request(
      '/product-systems',
      {
        method: 'get'
      }
    )
  }

  list_app_products (payload) {
    return this.do_request(
      '/apps/products',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_app_product (payload) {
    return this.do_request(
      '/apps/products',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_app_domains (payload) {
    return this.do_request(
      '/apps/domains',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_app_domain (payload) {
    return this.do_request(
      '/apps/domains',
      {
        method: 'post',
        payload,
      }
    )
  }

  delete_app_domain (payload) {
    return this.do_request(
      '/apps/domains',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_smtp (payload) {
    return this.do_request(
      '/smtp',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_smtp (payload) {
    return this.do_request(
      '/smtp',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_smtp (payload) {
    return this.do_request(
      '/smtp',
      {
        method: 'patch',
        payload,
      }
    )
  }

  remove_smtp (payload) {
    return this.do_request(
      '/smtp',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_traveler_fields (payload) {
    return this.do_request(
      '/traveler-fields/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  delete_traveler_fields (payload) {
    return this.do_request(
      '/traveler-fields',
      {
        method: 'delete',
        payload,
      }
    )
  }

  get_traveler_field (payload) {
    return this.do_request(
      '/traveler-fields',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_traveler_field (payload) {
    return this.do_request(
      '/traveler-fields',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_traveler_field (payload) {
    return this.do_request(
      '/traveler-fields',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_markups (payload) {
    return this.do_request(
      '/markups',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_markup (payload) {
    return this.do_request(
      '/markups',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_markup (payload) {
    return this.do_request(
      '/markups',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_markup (payload) {
    return this.do_request(
      '/markups',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_providers (payload) {
    return this.do_request(
      '/providers',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_places (payload) {
    return this.do_request(
      '/storage/places',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_properties (payload) {
    return this.do_request(
      '/storage/properties',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_rooms (payload) {
    return this.do_request(
      '/storage/rooms',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_room (payload) {
    return this.do_request(
      '/storage/rooms',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_tours (payload) {
    return this.do_request(
      '/storage/tours',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_airlines (payload) {
    return this.do_request(
      '/storage/airlines',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_airlines (payload) {
    return this.do_request(
      '/storage/airlines',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_airline (payload) {
    return this.do_request(
      '/storage/airlines',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_airports (payload) {
    return this.do_request(
      '/storage/airports',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_airports (payload) {
    return this.do_request(
      '/storage/airports',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_airports (payload) {
    return this.do_request(
      '/storage/airports',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_b2b_agents (payload) {
    return this.do_request(
      '/b2b/agents',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_b2b_agent (payload) {
    return this.do_request(
      '/b2b/agents',
      {
        method: 'post',
        payload,
      }
    )
  }

  remove_b2b_agents (payload) {
    return this.do_request(
      '/b2b/agents',
      {
        method: 'delete',
        payload,
      }
    )
  }

  update_b2b_agent (payload) {
    return this.do_request(
      '/b2b/agents',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_b2b_agent_types (payload) {
    return this.do_request(
      '/b2b/agent-types',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_b2b_agent_type (payload) {
    return this.do_request(
      '/b2b/agent-types',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_b2b_agent_type (payload) {
    return this.do_request(
      '/b2b/agent-types',
      {
        method: 'patch',
        payload,
      }
    )
  }

  remove_b2b_agent_types (payload) {
    return this.do_request(
      '/b2b/agent-types',
      {
        method: 'delete',
        payload,
      }
    )
  }

  upload_file (payload) {
    return this.do_request(
      '/storage/files',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_bookings (payload) {
    return this.do_request(
      '/bookings/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_booking (payload) {
    return this.do_request(
      '/bookings',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_booking (payload) {
    return this.do_request(
      '/bookings',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_booking_products (payload) {
    return this.do_request(
      '/bookings/products',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_booking_product (payload) {
    return this.do_request(
      '/bookings/products',
      {
        method: 'patch',
        payload
      }
    )
  }

  cancel_booking_product (payload) {
    return this.do_request(
      '/bookings/cancel',
      {
        method: 'patch',
        payload
      }
    )
  }

  list_booking_prices (payload) {
    return this.do_request(
      '/bookings/prices',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_booking_prices (payload) {
    return this.do_request(
      '/bookings/prices',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_booking_travelers (payload) {
    return this.do_request(
      '/bookings/travelers',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_booking_traveler (payload) {
    return this.do_request(
      '/bookings/travelers',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_flight_etickets (payload) {
    return this.do_request(
      '/bookings/products/flights/etickets',
      {
        method: 'get',
        payload
      }
    )
  }

  create_flight_eticket (payload) {
    return this.do_request(
      '/bookings/products/flights/eticket',
      {
        method: 'post',
        payload
      }
    )
  }

  update_flight_eticket (payload) {
    return this.do_request(
      '/bookings/products/flights/eticket',
      {
        method: 'patch',
        payload
      }
    )
  }

  list_events (payload) {
    return this.do_request(
      '/events',
      {
        method: 'get',
        payload,
      }
    )
  }

  send_booking_mail (payload) {
    return this.do_request(
      '/bookings/send-mail',
      {
        method: 'post',
        payload
      }
    )
  }

  list_payments (payload) {
    return this.do_request(
      '/payments/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_payment (payload) {
    return this.do_request(
      '/payments',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_cms_templates (payload) {
    return this.do_request(
      '/cms/templates',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_cms_landings (payload) {
    return this.do_request(
      '/cms/landing',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_cms_landing (payload) {
    return this.do_request(
      '/cms/landing',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_cms_landing (payload) {
    return this.do_request(
      '/cms/landing',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_cms_landing (payload) {
    return this.do_request(
      '/cms/landing',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_cms_nodes (payload) {
    return this.do_request(
      '/cms/nodes',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_cms_node_types (payload) {
    return this.do_request(
      '/cms/node-types',
      {
        method: 'get',
        payload,
      }
    )
  }

  upsert_cms_nodes (payload) {
    return this.do_request(
      '/cms/nodes',
      {
        method: 'post',
        payload,
      }
    )
  }

  init_cms_node (payload) {
    return this.do_request(
      '/cms/nodes/init',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_processes (payload) {
    return this.do_request(
      '/processes',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_process (payload) {
    return this.do_request(
      '/processes',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_goaway_packages (payload) {
    return this.do_request(
      '/goaway-packages/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_goaway_package (payload) {
    return this.do_request(
      '/goaway-packages',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_goaway_package (payload) {
    return this.do_request(
      '/goaway-packages',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_goaway_package (payload) {
    return this.do_request(
      '/goaway-packages',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_goaway_packages (payload) {
    return this.do_request(
      '/goaway-packages',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_goaway_categories (payload) {
    return this.do_request(
      '/goaway-packages/categories',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_goaway_category (payload) {
    return this.do_request(
      '/goaway-packages/categories',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_goaway_category (payload) {
    return this.do_request(
      '/goaway-packages/categories',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_goaway_category (payload) {
    return this.do_request(
      '/goaway-packages/categories',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_booking_product_logs (payload) {
    return this.do_request(
      '/bookings/products/logs',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_loggings (payload) {
    return this.do_request(
      '/loggings',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_shoppings (payload) {
    return this.do_request(
      '/shoppings/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_shopping (payload) {
    return this.do_request(
      '/shoppings',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_properties(payload) {
    return this.do_request(
      '/storage/properties',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_properties(payload) {
    return this.do_request(
      '/storage/properties',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_tour (payload) {
    return this.do_request(
      '/storage/tours',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_tour (payload) {
    return this.do_request(
      '/storage/tours',
      {
        method: 'patch',
        payload,
      }
    )
  }

  list_tour_tags (payload) {
    return this.do_request(
      '/storage/tours/tags',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_tour_tag (payload) {
    return this.do_request(
      '/storage/tours/tags',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_tour_tag (payload) {
    return this.do_request(
      '/storage/tours/tags',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_tour_tags (payload) {
    return this.do_request(
      '/storage/tours/tags',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_hotel_tags (payload) {
    return this.do_request(
      '/storage/properties/tags',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_hotel_tag (payload) {
    return this.do_request(
      '/storage/properties/tags',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_hotel_tag (payload) {
    return this.do_request(
      '/storage/properties/tags',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_hotel_tag (payload) {
    return this.do_request(
      '/storage/properties/tags',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_tags_categories (payload) {
    return this.do_request(
      '/storage/properties/tag_categories',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_tags_categories (payload) {
    return this.do_request(
      '/storage/properties/tag_categories',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_tags_categories (payload) {
    return this.do_request(
      '/storage/properties/tag_categories',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_tags_categories (payload) {
    return this.do_request(
      '/storage/properties/tag_categories',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_html_templates (payload) {
    return this.do_request(
      '/templates',
      {
        method: 'get',
        payload,
      }
    )
  }

  list_email_tracking (payload) {
    return this.do_request(
      '/email-tracking',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_html_template (payload) {
    return this.do_request(
      '/templates/details',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_html_template (payload) {
    return this.do_request(
      '/templates',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_html_template (payload) {
    return this.do_request(
      '/templates',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_html_templates (payload) {
    return this.do_request(
      '/templates',
      {
        method: 'delete',
        payload,
      }
    )
  }

  get_app_settings (payload) {
    return this.do_request(
      '/apps/settings',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_contact (payload) {
    return this.do_request(
      '/bookings/contact',
      {
        method: 'patch',
        payload,
      }
    )
  }

  get_booking_questions (payload) {
    return this.do_request(
      '/bookings/questions',
      {
        method: 'get',
        payload,
      }
    )
  }

  delete_booking_questions (payload) {
    return this.do_request(
      '/bookings/questions',
      {
        method: 'delete',
        payload,
      }
    )
  }

  update_booking_question (payload) {
    return this.do_request(
      '/bookings/questions',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_booking_question (payload) {
    return this.do_request(
      '/bookings/questions',
      {
        method: 'post',
        payload,
      }
    )
  }

  get_booking_product_pdf (payload) {
    return this.do_request(
      '/bookings/products/pdf',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_accounts (payload) {
    return this.do_request(
      '/iam/accounts/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_account (payload) {
    return this.do_request(
      '/iam/accounts',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_account (payload) {
    return this.do_request(
      '/iam/accounts',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_account (payload) {
    return this.do_request(
      '/iam/accounts',
      {
        method: 'post',
        payload,
      }
    )
  }

  account_roles (payload) {
    return this.do_request(
      '/iam/account_roles',
      {
        method: 'get',
        payload,
      }
    )
  }

  add_account_roles (payload) {
    return this.do_request(
      '/iam/account_roles',
      {
        method: 'post',
        payload,
      }
    )
  }

  account_apps (payload) {
    return this.do_request(
      '/iam/account_apps',
      {
        method: 'get',
        payload,
      }
    )
  }
  add_account_apps (payload) {
    return this.do_request(
      '/iam/account_apps',
      {
        method: 'post',
        payload,
      }
    )
  }

  role_permissions (payload) {
    return this.do_request(
      '/iam/role_permissions',
      {
        method: 'get',
        payload,
      }
    )
  }

  role_apps (payload) {
    return this.do_request(
      '/iam/role_apps',
      {
        method: 'get',
        payload,
      }
    )
  }

  role_policies (payload) {
    return this.do_request(
      '/iam/role_policies',
      {
        method: 'get',
        payload,
      }
    )
  }

  add_role_policies (payload) {
    return this.do_request(
      '/iam/role_policies',
      {
        method: 'post',
        payload,
      }
    )
  }

  add_role_permissions (payload) {
    return this.do_request(
      '/iam/role_permissions',
      {
        method: 'post',
        payload,
      }
    )
  }

  add_role_apps (payload) {
    return this.do_request(
      '/iam/role_apps',
      {
        method: 'post',
        payload,
      }
    )
  }

  policy_actions (payload) {
    return this.do_request(
      '/iam/policy_actions',
      {
        method: 'get',
        payload,
      }
    )
  }

  add_policy_actions (payload) {
    return this.do_request(
      '/iam/policy_actions',
      {
        method: 'post',
        payload,
      }
    )
  }

  get_action (payload) {
    return this.do_request(
      '/iam/actions',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_destination_mapping (payload) {
    return this.do_request(
      '/destination-mapping',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_destination_mapping (payload) {
    return this.do_request(
      '/destination-mapping',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_destination_mapping (payload) {
    return this.do_request(
      '/destination-mapping',
      {
        method: 'post',
        payload,
      }
    )
  }

  delete_destination_mapping (payload) {
    return this.do_request(
      '/destination-mapping',
      {
        method: 'delete',
        payload,
      }
    )
  }

  get_shopping_form (payload) {
    return this.do_request(
      '/shopping-form',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_shopping_form (payload) {
    return this.do_request(
      '/shopping-form',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_shopping_form (payload) {
    return this.do_request(
      '/shopping-form',
      {
        method: 'post',
        payload,
      }
    )
  }

  delete_shopping_form (payload) {
    return this.do_request(
      '/shopping-form',
      {
        method: 'delete',
        payload,
      }
    )
  }

  get_payment_gateway (payload) {
    return this.do_request(
      '/payment-gateway',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_payment_gateway (payload) {
    return this.do_request(
      '/payment-gateway',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_payment_gateway (payload) {
    return this.do_request(
      '/payment-gateway',
      {
        method: 'post',
        payload,
      }
    )
  }

  delete_payment_gateway (payload) {
    return this.do_request(
      '/payment-gateway',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_permission (payload) {
    return this.do_request(
      '/iam/permission/list',
      {
        method: 'get',
        payload,
      }
    )
  }

  get_permission (payload) {
    return this.do_request(
      '/iam/permission',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_permission (payload) {
    return this.do_request(
      '/iam/permission',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_permission (payload) {
    return this.do_request(
      '/iam/permission',
      {
        method: 'post',
        payload,
      }
    )
  }

  delete_permission (payload) {
    return this.do_request(
      '/iam/permission',
      {
        method: 'delete',
        payload,
      }
    )
  }

  create_role (payload) {
    return this.do_request(
      '/iam/role',
      {
        method: 'post',
        payload,
      }
    )
  }

  get_role (payload) {
    return this.do_request(
      '/iam/role',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_role (payload) {
    return this.do_request(
      '/iam/role',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_role (payload) {
    return this.do_request(
      '/iam/role',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_tour_mapping (payload) {
    return this.do_request(
      '/tour_mapping',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_tour_mapping (payload) {
    return this.do_request(
      '/tour_mapping',
      {
        method: 'patch',
        payload,
      }
    )
  }

  detail_tour_mapping (payload) {
    return this.do_request(
      '/tour_mapping/detail',
      {
        method: 'post',
        payload,
      }
    )
  }

  tour_mapping_region (payload) {
    return this.do_request(
      '/tour_mapping/region',
      {
        method: 'get',
        payload,
      }
    )
  }

  tour_mapping_category (payload) {
    return this.do_request(
      '/tour_mapping/category',
      {
        method: 'get',
        payload,
      }
    )
  }

  tour_detail_sync (payload) {
    return this.do_request(
      '/tour_mapping/detail/sync',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_promotions (payload) {
    return this.do_request(
      '/promo',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_promotion (payload) {
    return this.do_request(
      '/promo',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_promotion (payload) {
    return this.do_request(
      '/promo',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_promotions (payload) {
    return this.do_request(
      '/promo',
      {
        method: 'delete',
        payload,
      }
    )
  }

  create_report (payload) {
    return this.do_request(
      '/report-info',
      {
        method: 'post',
        payload,
      }
    )
  }

  get_report_config (payload) {
    return this.do_request(
      '/report/config',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_product_ranking (payload) {
    return this.do_request(
      '/product-ranking',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_product_ranking (payload) {
    return this.do_request(
      '/product-ranking',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_product_ranking (payload) {
    return this.do_request(
      '/product-ranking',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_product_ranking (payload) {
    return this.do_request(
      '/product-ranking',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_notes (payload) {
    return this.do_request(
      '/bookings/notes',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_notes (payload) {
    return this.do_request(
      '/bookings/notes',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_notes (payload) {
    return this.do_request(
      '/bookings/notes',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_product_blocking (payload) {
    return this.do_request(
      '/product-blocking',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_product_blocking (payload) {
    return this.do_request(
      '/product-blocking',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_product_blocking (payload) {
    return this.do_request(
      '/product-blocking',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_product_blocking (payload) {
    return this.do_request(
      '/product-blocking',
      {
        method: 'delete',
        payload,
      }
    )
  }

  create_addon_fee (payload) {
    return this.do_request(
      '/addon-fee',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_addon_fee (payload) {
    return this.do_request(
      '/addon-fee',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_addon_fee (payload) {
    return this.do_request(
      '/addon-fee',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_addon_fee (payload) {
    return this.do_request(
      '/addon-fee',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_subpromo (payload) {
    return this.do_request(
      '/sub-promo',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_subpromo (payload) {
    return this.do_request(
      '/sub-promo',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_subpromo (payload) {
    return this.do_request(
      '/sub-promo',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_subpromo (payload) {
    return this.do_request(
      '/sub-promo',
      {
        method: 'delete',
        payload,
      }
    )
  }

  get_estimate_flight_price (payload) {
    return this.do_request(
      '/estimate-flight-price',
      {
        method: 'get',
        payload,
      }
    )
  }

  update_estimate_flight_price (payload) {
    return this.do_request(
      '/estimate-flight-price',
      {
        method: 'patch',
        payload,
      }
    )
  }

  create_estimate_flight_price (payload) {
    return this.do_request(
      '/estimate-flight-price',
      {
        method: 'post',
        payload,
      }
    )
  }

  delete_estimate_flight_price (payload) {
    return this.do_request(
      '/estimate-flight-price',
      {
        method: 'delete',
        payload,
      }
    )
  }

  list_account_logging (payload) {
    return this.do_request(
      '/account_logging',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_account_logging (payload) {
    return this.do_request(
      '/account_logging',
      {
        method: 'post',
        payload,
      }
    )
  }

  list_cms_navigator_inject (payload) {
    return this.do_request(
      '/cms/navigator-inject',
      {
        method: 'get',
        payload,
      }
    )
  }

  create_cms_navigator_inject (payload) {
    return this.do_request(
      '/cms/navigator-inject',
      {
        method: 'post',
        payload,
      }
    )
  }

  update_cms_navigator_inject (payload) {
    return this.do_request(
      '/cms/navigator-inject',
      {
        method: 'patch',
        payload,
      }
    )
  }

  delete_cms_navigator_inject (payload) {
    return this.do_request(
      '/cms/navigator-inject',
      {
        method: 'delete',
        payload,
      }
    )
  }

}

export default Api

export const use_api = () => {
  const router = useRouter()
  const store = useStore()
  return new Api({store, router})
}
