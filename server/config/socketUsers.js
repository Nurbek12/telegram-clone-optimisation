export default class AU {
    constructor(){
        this.users = []
    }
    find(id){
        return this.users.find(u => u.id === id)
    }
    findWithSocket(id){
        return this.users.find(({socket}) => socket.id === id)
    }
    online(){
        return this.users.map(({id}) => id)
    }
    add(socket, id){
        this.users.push({
            socket, id
        })
    }
    remove(id){
        this.users = this.users.filter(({socket}) => socket.id !== id)
    }
}