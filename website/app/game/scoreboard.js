export default function Scoreboard({players}) {
    const playerScoreboard = () => {
        var listOfPlayers = [];
        var index = 0;
        for(const player of players) {
            listOfPlayers.push(
                <div key={index} className="flex items-center pb-5 max-w-[300px] ">
                    <img className='w-14 h-14' src={'/avatar' + player.avatar + '.png'} alt={player.avatar}></img>
                    <div className='text-lg ml-5 truncate'>{player.name}</div>
                    <div className='text-lg ml-auto'>{player.points}</div>
                </div>
            );
            index += 1;
        }
        return listOfPlayers;
    }

    return (
        <div className='mt-10 border-4 p-5 border-black rounded-md mb-5  overflow-y-auto aspect-[3/4]'>
            <h1 className='text-2xl mb-5'>Points</h1>
            <div>{playerScoreboard()}</div>

        </div>
    );
}