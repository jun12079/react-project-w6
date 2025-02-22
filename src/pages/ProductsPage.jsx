import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [qtySelect, setQtySelect] = useState(1);

    const addCartItem = async (product_id, qty) => {
        setIsLoading(true);
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
                data: {
                    product_id,
                    qty: Number(qty),
                },
            });
        } catch (error) {
            void error;
            alert("加入購物車失敗");
        } finally {
            setIsLoading(false);
            setQtySelect(1);
        }
    };

    useEffect(() => {
        const getProducts = async () => {
            setIsScreenLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
                setProducts(res.data.products);
            } catch (error) {
                void error;
                alert("取得產品失敗");
            } finally {
                setIsScreenLoading(false);
            }
        };
        getProducts();
    }, []);

    return (
        <>
            <div className="container">
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>商品圖片</th>
                                <th>商品名稱</th>
                                <th>價格</th>
                                <th>功能</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                return (
                                    <tr key={product.id}>
                                        <td width="15%">
                                            <img src={product.imageUrl} className="img-thumbnail" alt="商品圖片" />
                                        </td>
                                        <td>{product.title}</td>
                                        <td>
                                            <del className="h6">原價 {product.origin_price} 元</del>
                                            <div className="h5">特價 {product.price} 元</div>
                                        </td>
                                        <td>
                                            <div className="d-flex">
                                                <Link className="btn btn-outline-primary me-2" to={`/products/${product.id}`}>查看更多</Link>
                                                <button
                                                    onClick={
                                                        () => {
                                                            addCartItem(product.id, qtySelect);
                                                        }
                                                    }
                                                    type="button"
                                                    className="btn btn-primary d-flex" disabled={isLoading}
                                                >
                                                    {isLoading &&
                                                        <ReactLoading
                                                            type={"spin"}
                                                            color={"#000"}
                                                            height={"1.5rem"}
                                                            width={"1.5rem"}
                                                        />
                                                    }
                                                    加入購物車
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );

                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                isScreenLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(255,255,255,0.3)",
                            zIndex: 999,
                        }}
                    >
                        <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
                    </div>
                )
            }
        </>
    );
}