import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
    const { data: session } = useSession();
    const [showNav, setShowNav] = useState(false);

    if (!session) {
        return (
            <div
                className={"bg-violet-700 w-screen h-screen flex items-center"}>
                <div className="w-full flex items-center justify-center flex-col gap-10">
                    <h1 className="text-[3em] font-bold capitalize text-gray-900">
                        Welcome to Admin Panel
                    </h1>
                    <button
                        className="text-center bg-white p-2 px-4 rounded-lg mb-10 border-2 border-gray-300 hover:bg-gray-100 font-medium text-gray-700"
                        onClick={() => signIn("google")}>
                        <svg
                            className="w-6 h-6 inline-block mr-2"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M43.611 20.083H42V20H24V28H35.303C33.654 32.657 29.223 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24C4 35.045 12.955 44 24 44C35.045 44 44 35.045 44 24C44 22.659 43.862 21.35 43.611 20.083Z"
                                fill="#FFC107"
                            />
                            <path
                                d="M6.30603 14.691L12.877 19.51C14.655 15.108 18.961 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C16.318 4 9.65603 8.337 6.30603 14.691Z"
                                fill="#FF3D00"
                            />
                            <path
                                d="M24 44C29.166 44 33.86 42.023 37.409 38.808L31.219 33.57C29.1436 35.1484 26.6075 36.0021 24 36C18.798 36 14.381 32.683 12.717 28.054L6.19501 33.079C9.50501 39.556 16.227 44 24 44Z"
                                fill="#4CAF50"
                            />
                            <path
                                d="M43.611 20.083H42V20H24V28H35.303C34.5142 30.2164 33.0934 32.1532 31.216 33.571L31.219 33.569L37.409 38.807C36.971 39.205 44 34 44 24C44 22.659 43.862 21.35 43.611 20.083Z"
                                fill="#1976D2"
                            />
                        </svg>
                        Login with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-violet-700 min-h-screen">
            <div className="block md:hidden flex items-center p-4">
                <button onClick={() => setShowNav(true)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
                <div className="flex grow justify-center mr-6 text-white uppercase">
                    <Logo />
                </div>
            </div>
            <div className="flex">
                <Nav show={showNav} />
                <div className="bg-white flex-grow mt-2 mr-2 mb-2 ml-2 rounded-lg p-4 min-h-screen">
                    {children}
                    {/* Logged in: {session.user.email} */}
                </div>
                {/* <div>
                <img
                    src={session.user.image}
                    alt={session.user.name}
                    width={100}
                    height={100}
                    className="rounded-full border-2 border-black"
                />
            </div> */}
            </div>
        </div>
    );
}
