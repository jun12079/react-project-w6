import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DeleteProductModal({ tempProduct, isDeleteProductModalOpen, setIsDeleteProductModalOpen, getProducts }) {

    const delProductModalRef = useRef(null);

    const handleDeleteProduct = async () => {
        try {
            await deleteProduct();
            getProducts();
            handleCloseDelProductModal();
        } catch (error) {
            console.log(error)
            alert('刪除產品失敗')
        }
    }

    const deleteProduct = async () => {
        try {
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        new Modal(delProductModalRef.current, { backdrop: 'static' });
        delProductModalRef.current.addEventListener('hidden.bs.modal', () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        });
    }, [])

    useEffect(() => {
        if (isDeleteProductModalOpen) {
            const modalInstance = Modal.getInstance(delProductModalRef.current);
            modalInstance.show();
        }
    }, [isDeleteProductModalOpen])

    const handleCloseDelProductModal = () => {
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        modalInstance.hide();
        setIsDeleteProductModalOpen(false);
    }

    return (
        <div ref={delProductModalRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">刪除產品</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDelProductModal}></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除<span className="text-danger fw-bold">{tempProduct.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDelProductModal}>取消</button>
                        <button type="button" className="btn btn-danger" onClick={handleDeleteProduct}>刪除</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteProductModal;