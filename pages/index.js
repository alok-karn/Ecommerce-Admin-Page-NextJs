import Layout from "@/components/Layout";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();
    const handleSignOut = () => {
        signOut();
    };
    return (
        <Layout>
            <div className="text-black flex justify-between">
                <h2 className="text-3xl text-gray-800 drop-shadow-sm">
                    Welcome, <b>{session?.user?.name}</b> 😃
                </h2>
                <div className="flex flex-col gap-2 items-center">
                    <img
                        src={session?.user?.image}
                        className="w-10 h-10 rounded-full border-2 border-gray-500"
                    />
                    {/* <button
                        onClick={handleSignOut}
                        className="border-2 py-1 px-3 rounded-full text-sm font-medium text-gray-800 bg-slate-200 hover:bg-slate-300">
                        Sign Out
                    </button> */}
                </div>
            </div>
        </Layout>
    );
}
