import axios from "axios";

class ConnectionService {
    constructor() {
        let service = axios.create({
            baseURL: `${process.env.REACT_APP_SERVER_API}/api`,
            withCredentials: true
        });
        this.service = service;
    }

    createConnection(to) {
        return this.service.post(`/connections/${to}`);
    }

    deleteConnection(id) {
        return this.service.delete(`/connections/${id}`);
    }

    getUserConnections() {
        return this.service.get('/connections/user');
    }

}

export default ConnectionService;
