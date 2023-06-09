const API_BACKEND = "ws://localhost:8000";

const auth = {
    accessToken: 123,
    refreshToken: 456
}
const calculateSocket = io(`${API_BACKEND}/student`, { auth });

const data = {
    name: 'trung',
    age: 15
}
calculateSocket.emit('getStudent', { body: data }, (res) => {
    console.log(">>> Check res", res);
});
