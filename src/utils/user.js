import axios from "axios";

class UserService {
    constructor() {
        let service = axios.create({
            baseURL: `${process.env.REACT_APP_SERVER_API}/api`,
            withCredentials: true
        });
        this.service = service
    }

    getAllUsers() {
        return this.service.get('/users');
    }

    getUser(id) {
        return this.service.get(`/users/${id}`);
    }

    deleteUser(id) {
        return this.service.delete(`/users/${id}`)
    }

    editUser(id) {
        return this.service.put(`/users/${id}`)
    }

}

export default UserService;
