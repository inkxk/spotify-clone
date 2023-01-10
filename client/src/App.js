import Login from "./Login";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
    return code ? <Dashboard code={code}/> : <Login />;
}

export default App;

// login ผ่าน spotify-api-official จะได้ user-code อยู่ใน url
// get user-code จาก url ถ้ามี code แล้วจะส่งไปหน้า dashboard 
// นำ user-code ไป fetch data จาก api server หลังบ้าน
// server หลังบ้านใช้ lib spotify-web-api-node ในการจัดการแทน spotify-api-official