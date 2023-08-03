import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);

    const router = useRouter();

    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }

        axios.get("/api/products?id=" + id).then((response) => {
            // console.log(response.data);
            setProductInfo(response.data);
        });
    }, [id]);

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-4 capitalize text-gray-800 drop-shadow-sm">
                Let&apos;s edit product
            </h1>
            {productInfo && <ProductForm {...productInfo} />}
            {/* <ProductForm {...productInfo} /> */}
        </Layout>
    );
}
