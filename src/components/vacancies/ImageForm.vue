<template>
    <div>
        
        <div  v-if="loading" class="spinner-container">
            <VueSimpleSpinner size="70" :line-size="10" :speed="2"/>
        </div>

        <div v-if="!loading" class="images-container">

            <BaseButton class="button btn-secondary" @click="addImage()">
                <input type="file" class="file-input" ref="fileInput" @change="handleFileUpload()">
                <span class="svg-icon svg-icon-primary svg-icon-2x">
                <!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2020-09-15-014444/theme/html/demo2/dist/../src/media/svg/icons/Design/Image.svg-->
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <polygon points="0 0 24 0 24 24 0 24"/>
                            <path d="M6,5 L18,5 C19.6568542,5 21,6.34314575 21,8 L21,17 C21,18.6568542 19.6568542,20 18,20 L6,20 C4.34314575,20 3,18.6568542 3,17 L3,8 C3,6.34314575 4.34314575,5 6,5 Z M5,17 L14,17 L9.5,11 L5,17 Z M16,14 C17.6568542,14 19,12.6568542 19,11 C19,9.34314575 17.6568542,8 16,8 C14.3431458,8 13,9.34314575 13,11 C13,12.6568542 14.3431458,14 16,14 Z" fill="#000000"/>
                        </g>
                    </svg>
                <!--end::Svg Icon-->
                </span>
                Добавить
            </BaseButton>

            <BaseButton class="button btn-secondary" @click.prevent="closeImageModal()">
                <span class="svg-icon svg-icon-primary svg-icon-2x">
                <!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2020-09-15-014444/theme/html/demo2/dist/../src/media/svg/icons/Navigation/Close.svg-->
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g transform="translate(12.000000, 12.000000) rotate(-45.000000) translate(-12.000000, -12.000000) translate(4.000000, 4.000000)" fill="#000000">
                                <rect x="0" y="7" width="16" height="2" rx="1"/>
                                <rect opacity="0.3" transform="translate(8.000000, 8.000000) rotate(-270.000000) translate(-8.000000, -8.000000) " x="0" y="7" width="16" height="2" rx="1"/>
                            </g>
                        </g>
                    </svg>
                <!--end::Svg Icon-->
                </span>
                Выход
            </BaseButton>
            
            <div v-for="image in images" :key="image.id" class="image"
                :style="`background-image: url('${image.public_path}')`"
                @click="selectImage(image)"
            >

                <div class="delete-button" @click.stop="deleteImage(image.id)">

                    <span class="svg-icon svg-icon-primary svg-icon-2x">
                        <!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2020-09-15-014444/theme/html/demo2/dist/../src/media/svg/icons/Home/Trash.svg-->
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <rect x="0" y="0" width="24" height="24"/>
                                <path d="M6,8 L18,8 L17.106535,19.6150447 C17.04642,20.3965405 16.3947578,21 15.6109533,21 L8.38904671,21 C7.60524225,21 6.95358004,20.3965405 6.89346498,19.6150447 L6,8 Z M8,10 L8.45438229,14.0894406 L15.5517885,14.0339036 L16,10 L8,10 Z" fill="#000000" fill-rule="nonzero"/>
                                <path d="M14,4.5 L14,3.5 C14,3.22385763 13.7761424,3 13.5,3 L10.5,3 C10.2238576,3 10,3.22385763 10,3.5 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>
                            </g>
                        </svg>
                        <!--end::Svg Icon-->
                    </span>

                </div>

            </div>
        </div>

        <modal 
            name="error-form"                 
            height="auto"                
            :scrollable="true"
        >
            <div class="error-container">
                <div class="error-text-container">
                    <div class="error-text">
                        {{ this.error }}
                    </div>
                </div>
                <BaseButton @click.prevent="closeErrorModal()">OK</BaseButton>
            </div>
        </modal>    

    </div>
</template>

<script>

import VueSimpleSpinner from 'vue-simple-spinner'
import VacancyService from '@/services/VacancyService'

export default {
    
    name: 'VacancyImageForm',

    components: {
        VueSimpleSpinner
    },

    data() {
        return {
            loading: false,
            error: '',
        }
    },

    computed: {

        images() {
            return this.$store.state.vacancy.images
        },

    },

    async mounted() {
        this.loading = true;

        await this.$store.dispatch('vacancy/getAllImages')

        this.loading = false;
    },

    methods: {

        deleteImage(id) {
            this.loading = true;

            VacancyService.deleteImage(id).then(async () => {
                await this.$store.dispatch('vacancy/updateImages')
                this.loading = false;
            }).catch(errors => {
                let errorsObj = errors.response.data.errors
                this.error = 'Неизвестная ошибка'
                if (errorsObj && errorsObj.id && errorsObj.id[0]) {
                    this.error = errorsObj.id[0]
                }
                this.$modal.show('error-form')
                setTimeout(() => {
                    this.loading = false
                }, 1000)
            })
        },

        closeErrorModal() {
            this.$modal.hide('error-form')
        },

        closeImageModal() {
            this.$modal.hide('vacancy-image-form')
        },

        addImage() {
            this.$refs.fileInput.click()
        },

        handleFileUpload() {
            if (!this.$refs.fileInput.files[0]) {
                return
            }
            this.loading = true
            let formData = new FormData()
            formData.append('file', this.$refs.fileInput.files[0])
            VacancyService.addImage(formData).then(async () => {
                await this.$store.dispatch('vacancy/updateImages')
                this.loading = false
            }).catch(errors => {
                let errorsObj = errors.response.data.errors
                this.error = 'Неизвестная ошибка'
                if (errorsObj) {
                    if (errorsObj.file && errorsObj.file[0]) {
                        this.error = errorsObj.file[0]
                    } else if (errorsObj.file_name && errorsObj.file_name[0]) {
                        this.error = errorsObj.file_name[0]
                    }
                }
                this.$modal.show('error-form')
                setTimeout(() => {
                    this.loading = false
                }, 1000)
            })
        },

        selectImage(image) {
            this.$emit('onSelectImage', image)
        }

    },

}
</script>

<style scoped lang="scss">
$hover-element-background-color: #DDD;
$hover-element-border-color: #AAA;

.file-input{
    display: none;
}
.button {
    width: 280px;
    margin-left: 10px;
    margin-right: 10px !important;
    margin-top: 15px;
    margin-bottom: 10px;
}
.images-container {
    display: flex;
    flex-wrap: wrap;
}
.image {
    height: 200px;
    width: 290px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    margin: 5px;
    border: 1px solid #E5EAEE;
    border-radius: 0.42rem;
    position: relative;
    &:hover {
        cursor: pointer;
        background-color:$hover-element-background-color;
        border-color: $hover-element-border-color;
    }
}
.delete-button {
    background-color: white;
    position: absolute;
    border: 1px solid #E5EAEE;
    border-radius: 0.42rem;
    padding: 5px;
    bottom: 5px;
    right: 5px;
    &:hover {
        cursor: pointer;
        background-color:$hover-element-background-color;
        border-color: $hover-element-border-color;
    }
}
.error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
    padding-top: 10px;
}
.error-text-container {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.error-text {
    font-size: 20px;
    text-align: center;
    margin-left: 20px;
    margin-right: 20px;
}
</style>