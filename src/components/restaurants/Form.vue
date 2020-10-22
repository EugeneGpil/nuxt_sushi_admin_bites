<template>
    <div>

        <div  v-if="loading" class="spinner-container">
            <VueSimpleSpinner size="70" :line-size="10" :speed="2"/>
        </div>

        <div v-if="!loading" class="card card-custom">

            <div class="card-header">
                <h3 class="card-title">{{ restaurant ? 'Редактирование' : 'Создание' }} ресторана</h3>
            </div>

            <form>
                <div class="card-body"> 

                    <BaseSelect                      
                        placeholder="Город"               
                        label="Город"
                        :options='cities'
                        :error="errors.get('city_id')"
                        v-model="form.city.id"
                    />

                    <BaseInput
                        type="text"
                        label="Название"
                        :error="errors.get('name')"
                        v-model="form.name"
                    />

                    <BaseTextarea
                        rows="3"
                        label="Адрес"
                        :error="errors.get('address')"
                        v-model="form.address"
                    />

                </div>

                <div class="card-footer">
                    <BaseButton @click.prevent="save()">Сохранить</BaseButton>
                    <BaseButton btnClass="btn-secondary" @click.prevent="$modal.hide('restaurant-form')">Отменить</BaseButton>
                </div>

            </form>

        </div>
    
    </div>
</template>

<script>

import {Errors} from '@/classes/Errors'
import VueSimpleSpinner from 'vue-simple-spinner'
import RestaurantService from '@/services/RestaurantService'

export default {
    
    name: 'RestaurantForm',

    components: {
        VueSimpleSpinner,
    },

    props: {
        restaurant: Object
    },

    data() {
        return {
            loading: false,
            errors: new Errors(),
            form: {
                id: null,
                city: {
                    id: null,
                },
                name: null,
                address: null,
            },
        }
    },

    computed: {

        cities() {
            return this.$store.state.restaurants.cities
        },

    },

    async mounted() {
        this.loading = true

        if (this.restaurant) {
            this.form.id = this.restaurant.id
            this.form.city.id = this.restaurant.city.id
            this.form.name = this.restaurant.name
            this.form.address = this.restaurant.address
        }

        await this.$store.dispatch('restaurants/getCities')

        this.loading = false
    },

    methods: {

        save() {
            this.loading = true;

            let data = {}
            this.form.id ? data.id = this.form.id : ''
            data.city_id = this.form.city.id
            data.name = this.form.name
            data.address = this.form.address

            let serviceMethodName = 'createRestaurant'
            if (data.id) {
                serviceMethodName = 'updateRestaurant'
            }

            RestaurantService[serviceMethodName](data).then(() => {
                this.$emit('onSave')
                this.$modal.hide('restaurant-form')
                this.loading = false
            }).catch(errors => {
                this.$notify.error({                    
                    message: 'Ошибка сохранения ресторана'
                });

                if (errors.response.status == 422) {
                    this.errors.set(errors.response.data.errors);
                }

                this.loading = false
            })
        },

    },

}
</script>
