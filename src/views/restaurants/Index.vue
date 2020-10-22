<template>
    <div>

        <div class="card card-custom">
            <div class="card-header flex-wrap border-0 pt-6 pb-0">
                <div class="card-title">
                    <h3 class="card-label">Restaurants</h3>
                </div>
                <div class="card-toolbar">
                    <BaseCreateBtn
                        @click="addRestaurant()"
                    >Создать</BaseCreateBtn>
                </div>
            </div>
            <div class="card-body">
                <div class="dataTables_wrapper dt-bootstrap4 no-footer">
                    <v-server-table 
                        url="/admin/restaurants"
                        :columns="columns"
                        :options="options"
                        ref="restaurant-table"
                    >               
                        <div slot="actions" style="width: 50px; display: flex" slot-scope="props">
                            <BaseTableEditBtn class="edit-button" @click="editRestaurant(props.row)"/>
                            <BaseTableDeleteBtn @click="deleteRestaurant(props.row.id)"/>
                        </div>
                    </v-server-table>
                </div>           
            </div>
        </div>

        <modal 
            name="restaurant-form"                 
            height="auto"                
            :scrollable="true"
        >
            <RestaurantForm
                :restaurant="restaurant"
                @onSave="$refs['restaurant-table'].refresh()"
            />
        </modal>

    </div>
</template>

<script>

import {mixinTableProps} from '@/mixins/mixinTableProps'
import RestaurantForm from '@/components/restaurants/Form'
import RestaurantService from '@/services/RestaurantService'

export default {
    
    name: 'Index',

    mixins: [mixinTableProps],

    components: {
        RestaurantForm
    },

    data() {
        return {
            restaurant: null,
            columns: [
                'id',
                'city.title',
                'name',
                'address',
                'actions',
            ],
            options: {
                headings: {
                    'city.title': 'Город',
                    name: 'Название',
                    address: 'Адрес',
                    actions: 'Действия',
                },
            },
        }
    },

    methods: {

        editRestaurant(restaurant) {
            this.restaurant = restaurant
            this.$modal.show('restaurant-form')
        },

        addRestaurant() {
            this.restaurant = null
            this.$modal.show('restaurant-form')
        },

        deleteRestaurant(id) {
            this.$confirm('Вы действительно хотите удалить этот ресторан?').then(() => {
                RestaurantService.deleteRestaurant(id).then(() => {
                    this.$refs['restaurant-table'].refresh()
                    this.$notify({
                        title: 'Success',
                        message: 'Ресторан успешно удален',
                        type: 'success',
                    })
                }).catch(errors => {
                    this.$notify.error({
                        title: 'Error',
                        message: errors.response.status == 422
                            ? errors.response.data.errors.id[0]
                            : 'Ошибка удаления ресторана',
                        type: 'error',
                    })
                })
            })
        }

    }

}
</script>

<style scoped lang="scss">
.edit-button {
    margin-top: 2px;
}
</style>