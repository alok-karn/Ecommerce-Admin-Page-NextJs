import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

const NewProduct = () => {
    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-4 capitalize text-gray-800 drop-shadow-sm">
                Let&apos;s add some product
            </h1>
            <ProductForm />
        </Layout>
    );
};

export default NewProduct;
