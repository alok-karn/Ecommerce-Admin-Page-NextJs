import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();

    const [productInfo, setProductInfo] = useState();

    const goBack = () => {
        router.push("/products");
    };

    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get("/api/products?id=" + id).then((response) => {
            setProductInfo(response.data);
        });
    }, [id]);

    const handleDelete = async () => {
        await axios.delete("/api/products?id=" + id);
        goBack();
    };

    return (
        <Layout>
            <h1 className="text-2xl text-center">
                {" "}
                Do you really want to delete &quot;
                <b className="lowercase">{productInfo?.title}</b>&quot; ?
            </h1>
            <div className="flex gap-2 mt-4 justify-center">
                <button
                    onClick={handleDelete}
                    className=" bg-red-400 w-22 px-4 py-2 justify-center items-center rounded-lg font-medium hover:bg-red-500 text-gray-800">
                    Yes
                </button>
                <button
                    onClick={goBack}
                    className="flex gap-2 bg-violet-400 w-22 px-4 py-2 justify-center items-center rounded-lg font-medium hover:bg-violet-500 text-gray-800">
                    No
                </button>
            </div>
        </Layout>
    );
}
