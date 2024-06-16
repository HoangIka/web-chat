class database{
    constructor(){
        this.user = new Map();
        this.chat = new Map();
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

    getChat(id){
      console.log('chatData: '+this.chat.size)
      this.chat.forEach((v,k)=>{
        console.log(" "+k)
      })
        return this.chat.get(id);
    }

    addChat(id,data){
      console.log('chatData: '+this.chat.size)
      this.chat.forEach((v,k)=>{
        console.log(" "+k)
      })
      this.chat.set(id,data);
    }
    hasChat(id){
        return this.chat.has(id);
    }
}

module.exports = database;