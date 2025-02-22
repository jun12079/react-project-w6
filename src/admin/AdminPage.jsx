import { useState } from "react"
import LoginPage from "./LoginPage";
import ProductPage from "./ProductPage";



export default function AdminPage() {
	const [isAuth, setIsAuth] = useState(false);

	return (
		<>
			{isAuth ? <ProductPage setIsAuth={setIsAuth} /> : <LoginPage setIsAuth={setIsAuth} />}
		</>
	)
}