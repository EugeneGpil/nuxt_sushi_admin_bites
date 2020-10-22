export class Errors {

    constructor(){
        this.errors = {} 
    }

    set(data) {
        this.errors = data
    }

    has(field) {
        return Object.prototype.hasOwnProperty.call(this.errors, field)
    }

    get(field) {
        return this.has(field) ? this.errors[field][0] : null
    }

    clear(field) {
        delete this.errors[field];
    }

    clearAll() {
        this.errors = {}
    }
}