import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Avatar, Button, Card, CardHeader } from '@heroui/react';
import { AuthContext } from '../../Context/AuthContextProvider';
import { toast } from 'react-hot-toast';

export default function Suggestions() {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch suggestions
  const { data, isLoading } = useQuery({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/suggestions?limit=5`, {
        headers: { token }
      });
      return response.data.data;
    },
    enabled: !!token
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async (userId) => {
      return axios.put(`${import.meta.env.VITE_API_URL}/users/follow`, 
        { following: userId },
        { headers: { token } }
      );
    },
    onSuccess: () => {
      toast.success('Followed user');
      queryClient.invalidateQueries(['suggestions']);
      queryClient.invalidateQueries(['posts']);
    }
  });

  if (isLoading || !data?.length) return null;

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-5 bg-accent rounded-full" />
        Who to follow
      </h3>
      <div className="space-y-4">
        {data.map((user) => (
          <div key={user.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.photo}
                size="sm"
                className="ring-2 ring-accent/20"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-foreground/40 truncate">Suggested for you</p>
              </div>
            </div>
            <Button
              size="sm"
              radius="full"
              variant="flat"
              className="bg-accent/10 text-accent font-bold hover:bg-accent hover:text-white transition-all text-[10px] h-7"
              isLoading={followMutation.isPending && followMutation.variables === user.id}
              onPress={() => followMutation.mutate(user.id)}
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
