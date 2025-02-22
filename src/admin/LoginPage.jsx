import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {

    const [account, setAccount] = useState({
        "username": "",
        "password": ""
    });

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setAccount({
            ...account,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account)
            const { token, expired } = res.data;
            document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
            axios.defaults.headers.common['Authorization'] = token;
            setIsAuth(true);
        } catch (error) {
            console.log(error)
        }
    }

    const checkUserLogin = async () => {
        try {
            await axios.post(`${BASE_URL}/v2/api/user/check`);
            setIsAuth(true);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            checkUserLogin();
        }
    }, []);

    return (
        <>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input type="email" className="form-control" id="username" name="username" value={account.username} onChange={handleLoginInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" name="password" value={account.password} onChange={handleLoginInputChange} />
                                    </div>
                                    <button id="login" type="submit" className="btn btn-primary">登入</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;