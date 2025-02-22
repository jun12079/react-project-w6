import { NavLink, Outlet } from "react-router-dom";

const routes = [
    { path: "/", name: "首頁" },
    { path: "/products", name: "產品列表" },
    { path: "/cart", name: "購物車" },
];

export default function FrontLayout() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <ul className="navbar-nav">
                        {routes.map((route) => (
                            <li className="nav-item" key={route}>
                                <NavLink className="nav-link" to={route.path}>{route.name}</NavLink>
                            </li>
                        ))}
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/admin'}>登入</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    );
}