import Link from "next/link";

export default function Game(){
    

    return (
        <div className="w-full min-h-screen flex justify-center items-center p-24">
            <div className="w-96 text-center">
                <div className="text-xl ">Room Not Found</div>
                <Link className="underline text-cyan-500" href={"/"}>Return Home</Link>
            </div>
        </div>
    );
}