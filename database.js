class database{
    constructor(){
        this.user = new Map();
    }

    UpdateUser(key = String,value){
        this.user.set(key,value);
        return this;
    }

    addUser(key = String,value){
        this.user.set(key,value);
        return this;
    }

    hasUser(key = String){
        return this.user.has(key);
    }

    getUser(key){
        return this.user.get(key);
    }
}

module.exports = database;