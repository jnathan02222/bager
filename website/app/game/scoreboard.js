export default function Scoreboard({players}) {
    const playerScoreboard = () => {
        var listOfPlayers = []
        for(const player of players) {
            listOfPlayers.push(
                <div className="flex items-center pb-5 max-w-[300px]">
                    <div className="bg-black min-w-10 aspect-square	rounded-full"></div>
                    {/* <img className="w-10 h-10 rounded-full ml-5" src='/avatar' + avatar + '.png' alt={avatar} </img> */}
                    <div className='text-md ml-5 truncate'>{player["name"]}</div>
                    <div className='text-md ml-auto'>{player["score"]}</div>
                </div>
            )
        }
    }

    return (
        <div className='mt-10 border-4 p-5 border-black rounded-md mb-5'>
            <h1 className='text-2xl mb-5'>Points</h1>
            <div>{playerScoreboard()}</div>

        </div>
    );
}