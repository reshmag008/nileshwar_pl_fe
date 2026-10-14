import { useState } from 'react';
import { User, MapPin, Crosshair, Target, Pencil, Trash2,Clock ,CheckCircle,Phone} from 'lucide-react';
import { Player } from '@/types/player';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PlayerForm from './PlayerForm';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import PlayerService from '@/service/PlayerService';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const { deletePlayer } = usePlayer();
    const { isLoggedIn } = useAuth();
    const { players, setPlayers } = usePlayer();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [approvingPlayerId, setApprovingPlayerId] = useState<number | null>(null);
  

  const handleDelete = () => {
    deletePlayer(player.id);
    toast.success('Player deleted successfully!');
    setShowDeleteDialog(false);
  };

   const handleApprove = (playerId : any)=>{
        setApprovingPlayerId(playerId);
        PlayerService().approvePlayer(playerId).then((response:any)=>{
          console.log("response=== ", response)
          setApprovingPlayerId(null);
  
          let updatedPlayer = response.data;
  
          setPlayers((prev) =>
            prev.map((player) =>
              player.id === updatedPlayer.id
                ? { ...player, ...updatedPlayer }
                : player
            )
          );
  
          toast.success('Player approved successfully!');
  
        })
        
      }


  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Batsman':
        return 'bg-secondary text-secondary-foreground';
      case 'Bowler':
        return 'bg-primary text-primary-foreground';
      case 'All-Rounder':
        return 'bg-pitch-dark text-primary-foreground';
      case 'Wicket-Keeper':
      case 'Wicket-Keeper Batsman':
        return 'bg-gold-dark text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      
<div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-2xl">

  
{/* Player Photo - Full Width */}
<div className="relative w-full overflow-hidden bg-slate-100">

  {player.profile_image ? (
    <img
      src={`https://storage.googleapis.com/rajas_pl/${player.profile_image}`}
      alt={player.fullname}
      className="block h-auto max-h-[520px] min-h-[260px] w-full object-contain object-center transition-transform duration-300"
    />
  ) : (
    <div className="flex h-72 items-center justify-center bg-slate-100">
      <User className="h-24 w-24 text-slate-300" />
    </div>
  )}

  {/* Admin Payment Approval */}
  {isLoggedIn && player.status == 1 && (
    <div className="absolute left-2 top-2 z-20 flex max-w-[calc(100%-1rem)] items-center gap-2 rounded-xl border border-white/50 bg-slate-950/90 p-2 shadow-xl">
      {player.payment_screenshot ? (
        <a
          href={`https://storage.googleapis.com/rajas_pl/${player.payment_screenshot}`}
          target="_blank"
          rel="noopener noreferrer"
          title="View payment screenshot"
          className="shrink-0"
        >
          <img
            src={`https://storage.googleapis.com/rajas_pl/${player.payment_screenshot}`}
            alt="Payment Screenshot"
            className="h-12 w-9 rounded-md border border-white/40 object-contain sm:h-14 sm:w-11"
          />
        </a>
      ) : (
        <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md border border-dashed border-white/40 text-center text-[8px] text-white/70">
          No Image
        </div>
      )}

      {approvingPlayerId === player.id ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          Approving
        </div>
      ) : (
        <button
          type="button"
          onClick={() => handleApprove(player.id)}
          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white shadow-md transition hover:bg-green-500 active:scale-95"
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
      )}
    </div>
  )}

  {/* Bottom Image Gradient Overlay */}
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />

  {/* Player Role, Batting Style & Bowling Style */}
  <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">

    {/* Player Role Badge */}
    <div className="mb-3">
      <span className="inline-flex rounded-lg border border-yellow-300/60 bg-yellow-400 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-blue-950 shadow-lg sm:text-sm">
        {player.player_role || "Player"}
      </span>
    </div>

    {/* Batting and Bowling Details */}
    <div className="grid grid-cols-2 gap-3 border-t border-white/25 pt-3">

      {/* Batting Style */}
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 text-yellow-400">
          <Crosshair className="h-4 w-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
            Batting Style
          </span>
        </div>
        <p className="break-words text-sm font-extrabold leading-tight text-white sm:text-base">
          {player.batting_style || "N/A"}
        </p>
      </div>

      {/* Bowling Style */}
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 text-yellow-400">
          <Target className="h-4 w-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
            Bowling Style
          </span>
        </div>
        <p className="break-words text-sm font-extrabold leading-tight text-white sm:text-base">
          {player.bowling_style &&
          player.bowling_style !== "None"
            ? player.bowling_style
            : "N/A"}
        </p>
      </div>

    </div>
  </div>
</div>


  {/* Player Details */}
  <div className="space-y-5 bg-white p-4 sm:p-6">

    {/* Player Name */}
    <h3 className="break-words text-2xl font-black uppercase tracking-tight text-blue-950 sm:text-3xl">
      {player.id}. {player.fullname}
    </h3>

    {/* Player Information */}
   

<div className="grid grid-cols-2 gap-2">

  {/* Location */}
  <div className="flex min-w-0 items-start gap-2 rounded-xl bg-blue-50 p-2.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
      <MapPin className="h-4 w-4" />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
        Location
      </p>
      <p
        className="break-words text-xs font-bold leading-5 text-blue-950 sm:text-sm"
        title={player.location || "N/A"}
      >
        {player.location || "N/A"}
      </p>
    </div>
  </div>

  {/* Contact Number */}
  <div className="flex min-w-0 items-start gap-2 rounded-xl bg-blue-50 p-2.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
      <Phone className="h-4 w-4" />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
        Contact Number
      </p>
      <p
        className="break-all text-xs font-bold leading-5 text-blue-950 sm:text-sm"
        title={String(player.contact_no || "N/A")}
      >
        {player.contact_no || "N/A"}
      </p>
    </div>
  </div>

</div>



  </div>
</div>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-2 border-border max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Delete Player?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{player.fullname}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-2 border-border max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg sm:text-xl">Edit Player</DialogTitle>
          </DialogHeader>
          <PlayerForm editPlayer={player} onCancel={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayerCard;
