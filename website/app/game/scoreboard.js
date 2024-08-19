export default function Scoreboard(){
    return (
        <div className='mt-10 border-4 p-5 border-black rounded-md mb-5'>
            <h1 className='text-2xl mb-5'>Points</h1>

            <div className="flex items-center pb-5 max-w-[300px]">
                <div className="bg-black min-w-10 aspect-square	rounded-full"></div>
                <div className='text-md ml-5 truncate'>Baging with Bager</div>
                <div className='text-md ml-auto'>10</div>
            </div>
            <div className="flex items-center pb-5 max-w-[300px]">
                <div className="bg-black min-w-10 aspect-square	 rounded-full"></div>
                <div className='text-md ml-5 truncate'>Pedo</div>
                <div className='text-md ml-auto'>10</div>
            </div>
            <div className="flex items-center pb-5 max-w-[300px]">
                <div className="bg-black min-w-10 aspect-square	 rounded-full"></div>
                <div className='text-md ml-5 truncate'>Willy Wigger</div>
                <div className='text-md ml-auto'>10</div>
            </div>
            <div className="flex items-center pb-5 max-w-[300px]">
                <div className="bg-black min-w-10 aspect-square	 rounded-full"></div>
                <div className='text-md ml-5 truncate'>Amongus</div>
                <div className='text-md ml-auto'>10</div>
            </div>
        </div>
    );
}