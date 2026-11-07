import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
  XCircle,
  BadgeDollarSign,
  RefreshCcw,
  Pause,
  Play,
} from "lucide-react";
import PlayerService from "@/service/PlayerService";
import { BACKEND_URL, roomId, SOCKET_URL, TOTAL_PLAYER } from "../constants";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';


const AuctionPlayerPage: React.FC = () => {

  const baseAmount = 100;
  const [allTeams, setAllTeams] = useState<any>([]);
  const [bidFlow, setBidFlow] = useState<any>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [currentBidTeam, setCurrentBidTeam] = useState<any>({});
  const [players, setPlayers] = useState<any>([]);
  const [currentBidPlayer, setCurrentBidPlayer] = useState<any>({});
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [popUpContent, setPopUpContent] = useState<any>({})
  const [openPopUp, setOpenPopUp] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  const [isPaused, setIsPaused] = useState(false);

 



  useEffect(() => {
    const newSocket = io(SOCKET_URL,{
                transports: ["polling", "websocket"],
                withCredentials: true,
                reconnection: true,
            });
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
      if (socket) {

        socket.emit("join-room", roomId);

        socket.on("current_player", (data:any) => {
          console.log("Received:", data);
        });
        
      }
    }, [socket]);



  useEffect(() => {
    setBidFlow([]);
    setBidAmount(0);
    setCurrentBidTeam({})
    GetAllTeams();
    GetPlayer();
  }, []);


   const handleToggle = () => {
    setIsPaused((prev) => !prev);
    console.log("is paused=== ", isPaused);
localStorage.setItem("is_paused", String(isPaused));
  };



    const GetPlayer = () => {
    localStorage.setItem('close_popup', 'false');
    localStorage.setItem("team_complete",  JSON.stringify({}))
    console.log("searchText== ", searchText);
    setCurrentBidPlayer({});
    setPlayers([]);
    setBidFlow([]);
    setCurrentBidTeam({})
    setBidAmount(0)
    setIsLoading(true)
    PlayerService()
      .GetNonBidPlayers(searchText)
      .then((response: any) => {
        setIsLoading(false);
        let players = response?.data;
        setSearchText('')
        if (!players) {
          toast.success("No pending players");
          localStorage.setItem("selectedPlayer", JSON.stringify({}));
          localStorage.setItem("team_complete",  JSON.stringify({}))
          localStorage.setItem("currentBidTeam", JSON.stringify({}));
          localStorage.setItem('close_popup', 'false');
        }
        if (players?.id) {
          setCurrentBidPlayer(players);
          localStorage.setItem("selectedPlayer", JSON.stringify(players));
          localStorage.setItem("currentBidTeam", JSON.stringify({}));
          localStorage.setItem("team_complete",  JSON.stringify({}))
          localStorage.setItem('close_popup', 'false');
          PlayerService().displayPlayer(players).then((response: any) => {
      console.log("response== ", response);
    })
      socket.emit('current_player', JSON.stringify(players));
          
        } 
      });
  };

  const selectRandomPlayer = () => {
    const random = Math.floor(Math.random() * players.length);
    console.log(random, players[random]);
    setCurrentBidPlayer(players[random]);
    console.log("currentBidPlayer== ", players[random]);
    localStorage.setItem("currentBidTeam", JSON.stringify({}));
    localStorage.setItem("selectedPlayer", JSON.stringify(players[random]));
    localStorage.setItem("team_complete",  JSON.stringify({}))
    localStorage.setItem('close_popup', 'false');
    PlayerService().displayPlayer(players[random]).then((response: any) => {
      console.log("response==displayPlayer ", response);
    })
    setIsLoading(false);
  };
  

   const GetAllTeams = () => {
    try {
      PlayerService()
        .getAllTeams()
        .then((response: any) => {
          setAllTeams(response?.data);
        });
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  

  const player = {
    id: 101,
    name: "Virat Kohli",
    image:
      "https://placehold.co/250x250/png?text=Player",
  };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("value=== ", value);
    setSearchText(value);
  };

  const cardClick = (team: any, index: number) => {
    console.log("bidFlow.value== ", bidFlow);
    if (bidFlow.length === 0) {
      let flow = [];
      let amount = bidAmount + baseAmount;
      if (amount > team.max_bid_amount) {
        toast.error('Bid amount larger than max amount')
      } else {
        setCurrentBidTeam(team);
        console.log("amount== ", amount);
        setBidAmount(amount);
        let flowItem = { id: team.id, team_name: team.team_name, amount: amount }
        flow.push(flowItem);
        localStorage.setItem("currentBidTeam", JSON.stringify(flowItem));
        console.log("flow== ", flow);
        InvokeTeamCall(flow[flow.length - 1])
        setBidFlow(flow);
        console.log("bidFlow== ", bidFlow);
      }
    }
    if (bidFlow && bidFlow.length && bidFlow.length > 0) {
      if (bidFlow[bidFlow.length - 1].id !== team.id) {
        // let amount = bidAmount + baseAmount;
        let amount;
        let lastBidAmount = bidFlow[bidFlow.length - 1].amount;
        console.log("lastBidAmount=== ", lastBidAmount);
        if(lastBidAmount >= 10000){
        amount = bidAmount + 50
        }else{
          amount = bidAmount + 50
        }

        if (amount > team.max_bid_amount) {
          toast.error('Bid amount larger than max amount')
        } else {
          setCurrentBidTeam(team);
          
          // socket.emit('current_bid' , {'team_name' :team.team_name, 'points':amount })
          setBidAmount(amount);
          let flow = bidFlow;
          let flowItem = {
            id: team.id,
            team_name: team.team_name,
            amount: amount,
          }
          flow.push(flowItem);
          localStorage.setItem("currentBidTeam", JSON.stringify(flowItem));
          InvokeTeamCall(flow[flow.length - 1])
          setBidFlow(flow);
          console.log("bidFlow== ", bidFlow);
        }
      }
    }

  };

  const InvokeTeamCall = (teamcallData: any) => {
    PlayerService().teamCall(teamcallData).then((response: any) => {

    })
  }


    const sellPlayer = () => {
    setIsLoading(true);
    if (currentBidTeam && currentBidTeam.id) {
      let params = {
        id: currentBidPlayer.id,
        team_id: currentBidTeam.id,
        bid_amount: bidAmount,
        team_name: currentBidTeam.team_name,
        player_name: currentBidPlayer.fullname
      };
      console.log("params== ", params);


      PlayerService().sellPlayer(params).then((response: any) => {
        console.log("response.data==", response.data);
        GetPlayer();
        GetAllTeams();
        setBidFlow([]);
        setBidAmount(0);
        setCurrentBidTeam({})
        if (response.data && response.data.player_count === TOTAL_PLAYER) {
          localStorage.setItem("team_complete",JSON.stringify(response.data))
          InvokeTeamComplete(response.data)
          setOpenPopUp(true);
          setPopUpContent(response.data);
        }
      })
    } else {
      setIsLoading(false);
      toast.warning("Please select a team and amount.");
    }

  }

  const InvokeTeamComplete = (teamData: any) => {
    PlayerService().teamComplete(teamData)
  }

  const InvokeClosePopup = () => {
    localStorage.setItem('close_popup', 'true');
    PlayerService().closePopup()
  }

  const handleBidChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBidAmount(event.target.value ? parseInt(event.target.value) : 0);
  }

  const getUnsoldPlayers = () => {
    PlayerService().getUnsoldPlayers().then((response: any) => {
      console.log("response== ", response);
      if (response && response.data && response.data.length && response.data[0] > 0) {
        GetPlayer();
      } else {
        toast.success("Unsold players not found");
      }
    })
  }
  

    const setUnsoldPlayer = () => {
    setIsLoading(true);
    let params = {
      id: currentBidPlayer.id,
      un_sold: true
    }
    localStorage.setItem("selectedPlayer", JSON.stringify({}));
    PlayerService().setUnsoldPlayer(params).then((response: any) => {
      console.log("response== ", response.data);
      GetPlayer();
    })
  }

    const handleBidBack = () => {
    let flow = bidFlow;
    flow.pop();
    console.log("flow=== ", flow);
    setBidFlow(flow);
    console.log("bidfloww== ", bidFlow);
    if (bidFlow && bidFlow.length > 0) {
      let currentTeam = bidFlow[bidFlow.length - 1];
      console.log("currentTeam== ", currentTeam);
      setCurrentBidTeam(currentTeam);
      setBidAmount(currentTeam.amount)
    }
    if (bidFlow.length === 0) {
      let currentTeam = {};
      setCurrentBidTeam(currentTeam);
      setBidAmount(0);
    }
  }



  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">

     

      {/* Player Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">

        {isLoading && (

       <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">

    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>

    <p className="mt-4 text-lg font-semibold text-gray-700">
      Loading Player...
    </p>

  </div>
</div>

)}

        {currentBidPlayer && currentBidPlayer.id && (
        <div className="overflow-hidden rounded-xl border border-green-200 bg-white shadow-md">

  {/* Header */}
  <div className="bg-gradient-to-r from-green-900 to-green-600 px-4 py-2">
    <h2 className="text-center text-lg font-extrabold text-white">
      PLAYER PROFILE
    </h2>
  </div>

  {/* Player Details */}
  <div className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:items-start">

    {/* Player Image */}
    <img
      src={`https://storage.googleapis.com/rajas_pl/${currentBidPlayer.profile_image}`}
      alt={currentBidPlayer.fullname}
      className="h-35 w-28 shrink-0 rounded-xl border-2 border-green-600 object-cover sm:h-38 sm:w-32"
    />

    {/* Player Information */}
    <div className="w-full flex-1">

      {/* Name */}
      <div className="mb-3 text-center sm:text-left">
        <p className="text-xs font-bold text-green-700">
          #{currentBidPlayer.id}
        </p>

        <h2 className="text-xl font-extrabold text-gray-900">
          {currentBidPlayer.fullname}
        </h2>
      </div>

      {/* Role & Contact */}
      <div className="mb-2 grid grid-cols-2 gap-2">

        <div className="rounded-lg bg-green-100 px-3 py-2">
          <p className="text-xs font-medium text-green-700">Role</p>
          <p className="text-sm font-bold text-green-950">
            {currentBidPlayer.player_role}
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <p className="text-xs text-green-700">Contact Number</p>
          <p className="text-sm font-bold text-green-950">
            {currentBidPlayer.contact_no || "-"}
          </p>
        </div>

      </div>

      {/* Batting & Bowling */}
      <div className="grid grid-cols-2 gap-2">

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Batting Style</p>
          <p className="text-sm font-semibold text-gray-900">
            {currentBidPlayer.batting_style || "-"}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Bowling Style</p>
          <p className="text-sm font-semibold text-gray-900">
            {currentBidPlayer.bowling_style || "-"}
          </p>
        </div>

      </div>

    </div>
  </div>

  {/* Bottom Accent */}
  <div className="h-1 bg-gradient-to-r from-green-900 via-lime-500 to-green-700" />

</div>
        )}

        {/* Search and Action Buttons */}
        <div className="mt-8 flex flex-col lg:flex-row gap-4">
          <div className="flex flex-1 gap-3">
            <input
              type="text"
              placeholder="Id"
              value={searchText}
              onChange={handleInputChange}
              className="w-20 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={GetPlayer}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={sellPlayer}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
            >
              <BadgeDollarSign size={18} />
              Sell
            </button>

            <button
              onClick={setUnsoldPlayer}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
            >
              <XCircle size={18} />
              Unsold
            </button>

            <button
              onClick={handleBidBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              onClick={getUnsoldPlayers}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
            >
              <RefreshCcw size={18} />
              Get Unsold Players
            </button>

            <button
              onClick={handleToggle}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white transition-all ${
                !isPaused
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {!isPaused ? (
                <>
                  <Play size={18} />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={18} />
                  Pause
                </>
              )}
            </button>


          </div>
        </div>

        {/* Teams Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-5">Teams</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {allTeams.map((team:any, index:any) => (
              <>
              {team.player_count != TOTAL_PLAYER && 
              <div
                key={team.id}
                onClick={() => cardClick(team, index)}
                className="bg-gray-50 hover:bg-blue-50 border rounded-xl p-4 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center"
              >
                <img
                  src={`https://storage.googleapis.com/rajas_pl/${team.team_logo}`}
                  alt={team.team_name}
                  className="w-20 h-20 object-contain mb-3"
                />

                <p className="text-center font-semibold text-gray-700">
                  {team.team_name}
                </p>

                {currentBidTeam && currentBidTeam.id === team.id && (
                <input
                value={bidAmount}
        type="text"
        placeholder="Bid Points"
        onChange={handleBidChange} 
        className="w-full border rounded-lg px-3 py-2 text-sm mb-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
               )}

      <p className="text-center font-semibold text-gray-700">
                  Max Bid: {team.max_bid_amount}
                </p>


                <p className="text-center font-semibold text-gray-700">
                  Total Points: {team.total_points}
                </p>
                <p className="text-center font-semibold text-gray-700">
                  Players : ({team.player_count}/{TOTAL_PLAYER})
                </p>

              </div>
              }
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPlayerPage;