'use client';

import { useState } from 'react';
import { UserGameStatus } from '../types';
import { supabaseClient } from '../../lib/supabaseClient';

type AddGameModalProps = {
  isOpen: boolean;
  game: any;
  onClose: () => void;
  onSave?: () => void;
};

export default function AddGameModal({ isOpen, game, onClose, onSave }: AddGameModalProps) {
  const [status, setStatus] = useState<UserGameStatus>('backlog');
  const [platform, setPlatform] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!game) return;
    setIsSaving(true);
    try {
      const { error } = await supabaseClient.from('games').upsert({ 
        id: game.id, 
        title: game.name, 
        cover_image: game.background_image || '' 
      }).select();
      
      if (error) {
        console.error('Failed to save game metadata:', error);
        setIsSaving(false);
        return;
      }
      
      const { error: gameError } = await supabaseClient.from('user_games').upsert({ 
        game_id: game.id, 
        status, 
        platform_played: platform 
      }).select();
      
      if (gameError) {
        console.error('Failed to save game status:', gameError);
        setIsSaving(false);
        return;
      }

      setIsSaving(false);
      onSave?.();
      onClose();
    } catch (err) {
      console.error('Error saving game:', err);
      setIsSaving(false);
    }
  };

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6">
        <h2 className="mb-4 text-2xl font-bold">{game.name}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as UserGameStatus)}
              className="w-full rounded-lg bg-black/80 border border-white/20 p-2 text-white"
            >
              <option value="playing">Playing</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
              <option value="backlog">Backlog</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Platform</label>
            <input 
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g. PC, PlayStation 5"
              className="w-full rounded-lg bg-black/80 border border-white/20 p-2 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-lg bg-red-900 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Add to Library'}
          </button>
        </div>
      </div>
    </div>
  );
}