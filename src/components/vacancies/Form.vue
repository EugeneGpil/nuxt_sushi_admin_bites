<template>
    <div>

        <div  v-if="loading" class="spinner-container">
            <VueSimpleSpinner size="70" :line-size="10" :speed="2"/>
        </div>

        <div v-if="!loading" class="card card-custom">

            <div class="card-header">
                <h3 class="card-title">Редактирование вакансии</h3>
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

                    <BaseSelect                      
                        placeholder="Ресторан"               
                        label="Ресторан"
                        :options='restaurants'
                        :error="errors.get('restaurant_id')"
                        v-model="form.restaurant.id"
                        optionTitle="name"
                    />

                    <BaseInput
                        type="text"
                        label="Название"
                        :error="errors.get('name')"
                        v-model="form.name"
                    />

                    <BaseTextarea
                        rows="3"
                        label="График"
                        :error="errors.get('schedule')"
                        v-model="form.schedule"
                    />

                    <BaseTextarea
                        rows="3"
                        label="Опыт работы"
                        :error="errors.get('work_experience')"
                        v-model="form.work_experience"
                    />

                    <BaseTextarea
                        rows="3"
                        label="Обязанности"
                        :error="errors.get('duties')"
                        v-model="form.duties"
                    />

                    <BaseTextarea
                        rows="3"
                        label="Контакты"
                        :error="errors.get('contacts')"
                        v-model="form.contacts"
                    />

                    <BaseTextarea
                        rows="3"
                        label="Требования"
                        :error="errors.get('requirements')"
                        v-model="form.requirements"
                    />

                    <BaseTextarea
                        rows="3"
                        label="Условия"
                        :error="errors.get('terms')"
                        v-model="form.terms"
                    />

                    <div class="form-group">
                        <label>Изображение</label>
                        <div class="image-border" :class="{'image-invalid': errors.has('image_id')}" @click="openImageModal()">
                            <div class="image-name">{{ form.image.name }}</div>
                            <div class="image-container"
                                :style="`background-image: url('${form.image.public_path}')`"
                            ></div>
                        </div>
                        <div class="invalid-feedback" v-if="errors.has('image_id')">
                            {{ errors.get('image_id') }}
                        </div>
                    </div>

                </div>

                <div class="card-footer">
                    <BaseButton @click.prevent="save()">Сохранить</BaseButton>
                    <BaseButton btnClass="btn-secondary" @click.prevent="$modal.hide('vacancy-form')">Отменить</BaseButton>
                </div>

            </form>

        </div>

        <modal
            name="vacancy-image-form"
            height="auto"
            :scrollable="true"
        >
            <ImageForm 
                @onSelectImage="onSelectImage"
            />
        </modal>
    
    </div>
</template>

<script>

import {Errors} from '@/classes/Errors'
import VueSimpleSpinner from 'vue-simple-spinner'
import ImageForm from '@/components/vacancies/ImageForm'
import VacancyService from '@/services/VacancyService'

export default {
    
    name: 'VacancyForm',

    components: {
        VueSimpleSpinner,
        ImageForm
    },

    props: {
        vacancy: Object
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
                restaurant: {
                    id: null,
                },
                name: null,
                schedule: null,
                work_experience: null,
                duties: null,
                contacts: null,
                requirements: null,
                terms: null,
                image: {
                    id: null,
                    name: null,
                    public_path: null,
                },
            },
        }
    },

    computed: {

        cities() {
            return this.$store.state.vacancy.cities
        },

        restaurants() {
            let allRestaurants = this.$store.state.vacancy.restaurants

            let restaurantsByCity = []

            for (let i = 0; i < allRestaurants.length; i++) {
                let restaurant = allRestaurants[i]
                if (restaurant.city_id == this.form.city.id) {
                    restaurantsByCity.push(JSON.parse(JSON.stringify(restaurant)))
                }
            }

            return restaurantsByCity
        },

        cityId() {
            return this.form.city.id
        }

    },

    async mounted() {
        this.loading = true

        if (this.vacancy) {
            this.form.id = this.vacancy.id
            this.form.city.id = this.vacancy.city.id
            this.form.restaurant.id = this.vacancy.restaurant.id
            this.form.name = this.vacancy.name
            this.form.schedule = this.vacancy.schedule
            this.form.work_experience = this.vacancy.work_experience
            this.form.duties = this.vacancy.duties
            this.form.contacts = this.vacancy.contacts
            this.form.requirements = this.vacancy.requirements
            this.form.terms = this.vacancy.terms
            this.form.image.id = this.vacancy.image.id
            this.form.image.name = this.vacancy.image.name
            this.form.image.public_path = this.vacancy.image.public_path
        }

        await Promise.all([
            this.$store.dispatch('vacancy/getCities'),
            this.$store.dispatch('vacancy/getRestaurantsByCityId', this.form.city.id)
        ]);

        this.loading = false
    },

    watch: {

        async cityId() {
            if (this.loading) {
                return
            }
            await this.$store.dispatch('vacancy/getRestaurantsByCityId', this.form.city.id)
            this.form.restaurant.id = this.restaurants.length ? this.restaurants[0].id : null
        }

    },

    methods: {

        openImageModal() {
            this.$modal.show('vacancy-image-form')
        },

        onSelectImage(image) {
            this.form.image.id = image.id
            this.form.image.name = image.name
            this.form.image.public_path = image.public_path
            console.log(this.form.image.public_path)
            this.$modal.hide('vacancy-image-form')
        },

        save() {
            this.loading = true;

            let data = {}
            this.form.id ? data.id = this.form.id : ''
            data.restaurant_id = this.form.restaurant.id
            data.name = this.form.name
            data.schedule = this.form.schedule
            data.work_experience = this.form.work_experience
            data.duties = this.form.duties
            data.contacts = this.form.contacts
            data.requirements = this.form.requirements
            data.terms = this.form.terms
            data.image_id = this.form.image.id

            let serviceMethodName = 'addVacancy'
            if (data.id) {
                serviceMethodName = 'updateVacancy'
            }

            VacancyService[serviceMethodName](data).then(() => {
                this.$emit('onSave')
                this.$modal.hide('vacancy-form')
                this.loading = false
            }).catch(errors => {
                this.$notify.error({                    
                    message: 'Ошибка сохранения вакансии'
                });

                if (errors.response.status == 422) {
                    this.errors.set(errors.response.data.errors);
                }

                this.loading = false
            })
        }

    }

}
</script>

<style scoped lang="scss">
.image-name {
    font-size: 11px;
    margin-bottom: 10px;
}
.image-container {
    height: 200px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.image-border {
    border: 1px solid #E5EAEE;
    border-radius: 0.42rem;
    padding: 10px;
    &:hover {
        cursor: pointer;
    }
}
.card-footer {
    display: flex;
    justify-content: space-between;
}
.btn-secondary {
    margin-right: 0 !important;
}
.form-group:last-child {
    margin-bottom: 0;
}
.image-invalid {
    border-color: #F64E60;
}
</style>