import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="container mt-5">
            <h1>404 - Not Found</h1>
            <Link to="/">回首頁</Link>
        </div>
    );
}