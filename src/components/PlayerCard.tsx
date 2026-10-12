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
      
<div className="group relative overflow-hidden rounded-2xl border-2 border-blue-500/40 bg-[#06152f] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/70 hover:shadow-2xl">

  {/* Stadium Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#06152f] via-[#102d59] to-[#030b1b]" />

  {/* Decorative Cricket Theme */}
  <div className="absolute inset-0 opacity-20">
    <div className="absolute -left-16 top-20 h-48 w-48 rounded-full bg-orange-500 blur-[90px]" />
    <div className="absolute -right-12 top-32 h-48 w-48 rounded-full bg-blue-500 blur-[90px]" />
    <div className="absolute bottom-20 left-1/3 h-40 w-40 rounded-full bg-red-600 blur-[90px]" />
  </div>

  {/* Player Image Section */}
  <div className="relative h-56 overflow-hidden sm:h-72">

    {/* Player image */}
    {player.profile_image ? (
      <img
        src={`https://storage.googleapis.com/rajas_pl/${player.profile_image}`}
        alt={player.fullname}
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    ) : (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-950 to-slate-900">
        <User className="h-24 w-24 text-white/30" />
      </div>
    )}

    {/* Image overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#06152f] via-[#06152f]/20 to-black/30" />

{/* Role badge */}
    <div className="absolute right-3 top-3 -rotate-2 rounded-sm bg-yellow-400 px-3 py-1.5 shadow-lg">
      <span className="text-xs font-black uppercase tracking-wide text-[#06152f]">
        {player.player_role}
      </span>
    </div>
    

    {/* Admin Overlay */}
    {isLoggedIn && player.status == 1 && (
      <div className="absolute left-0 top-0 z-20 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-xl border border-white/20 bg-black/85 p-2 shadow-xl backdrop-blur-md">

        {/* Payment Screenshot */}
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
              className="h-14 w-10 rounded-md border border-white/40 object-cover transition-transform hover:scale-105 sm:h-16 sm:w-12"
            />
          </a>
        ) : (
          <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md border border-dashed border-white/40 text-center text-[9px] text-white/70">
            No Image
          </div>
        )}

        {/* Approve Button */}
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
            <span>Approving</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleApprove(player.id)}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white shadow-lg transition-all hover:bg-green-500 active:scale-95"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </button>
        )}
      </div>
    )}
    
  </div>

  {/* Player Details */}
  <div className="relative space-y-3 p-4 sm:p-5">

     <h3 className="mt-2 truncate text-center text-base font-bold text-white">
  {player.fullname.toUpperCase()}
</h3>

    <div className="grid grid-cols-2 gap-3 text-sm text-white/90">

   

  {/* Location */}
  <div className="flex min-w-0 items-center gap-2">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
      <MapPin className="h-4 w-4 text-yellow-400" />
    </div>
    <span className="truncate font-medium" title={player.location}>
      {player.location || "N/A"}
    </span>
  </div>

  {/* Contact Number */}
  <div className="flex min-w-0 items-center gap-2">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/20">
      <Phone className="h-4 w-4 text-green-400" />
    </div>
    <span className="truncate font-medium" title={String(player.contact_no || "")}>
      {player.contact_no || "N/A"}
    </span>
  </div>
</div>

   {/* Batting & Bowling Style */}
<div className="grid grid-cols-2 gap-3 text-sm text-white/90">

  {/* Batting Style */}
  {player.batting_style ? (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/20">
        <Crosshair className="h-4 w-4 text-red-400" />
      </div>
      <span className="truncate font-medium" title={player.batting_style}>
        {player.batting_style}
      </span>
    </div>
  ) : (
    <div />
  )}

  {/* Bowling Style */}
  {player.bowling_style && player.bowling_style !== "None" ? (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/20">
        <Target className="h-4 w-4 text-green-400" />
      </div>
      <span className="truncate font-medium" title={player.bowling_style}>
        {player.bowling_style}
      </span>
    </div>
  ) : (
    <div />
  )}

</div>
    {/* Footer Status */}
    {/* <div className="border-t border-white/15 pt-3">
      {player.status == 2 ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-400/20 bg-green-500/10 px-3 py-2">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-400" />
          <div>
            <p className="text-sm font-bold text-green-400">
              Approved
            </p>
            <p className="text-xs text-green-100/70">
              Payment verified
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-400/20 bg-yellow-500/10 px-3 py-2">
          <Clock className="h-5 w-5 shrink-0 text-yellow-400" />
          <div>
            <p className="text-sm font-bold text-yellow-400">
              Registration Pending
            </p>
            <p className="text-xs text-white/60">
              Awaiting approval
            </p>
          </div>
        </div>
      )}
    </div> */}

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
