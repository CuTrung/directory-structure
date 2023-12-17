const API_BACKEND = "ws://localhost:3002/socket";

const auth = {
  accessToken: 123,
  refreshToken: 456,
};
const calculateSocket = io(`${API_BACKEND}/hello`, { auth });

const data = {
  name: "trung",
  age: 15,
};
calculateSocket.emit("talk", { body: data }, (res) => {
  console.log(">>> Check res", res);
});

calculateSocket.emit("go", { body: data }, (res) => {
  console.log(">>> Check res", res);
});
