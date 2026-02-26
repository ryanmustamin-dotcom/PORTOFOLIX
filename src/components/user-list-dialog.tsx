'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { sampleUsers } from '@/lib/sample-data';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface UserListDialogProps {
  title: string;
  userIds: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserListDialog({ title, userIds, isOpen, onOpenChange }: UserListDialogProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen || userIds.length === 0) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const resultUsers: UserProfile[] = [];
        const remainingUids: string[] = [];

        // 1. Cek di sample users dulu
        userIds.forEach(uid => {
          const sample = sampleUsers.find(u => u.uid === uid);
          if (sample) {
            resultUsers.push(sample);
          } else {
            remainingUids.push(uid);
          }
        });

        // 2. Fetch sisanya dari Firestore
        if (remainingUids.length > 0 && firestore) {
          const usersRef = collection(firestore, 'users');
          // Firestore 'in' query limit is 10, but for simplicity in MVP we assume small lists
          const q = query(usersRef, where('uid', 'in', remainingUids.slice(0, 10)));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            resultUsers.push(doc.data() as UserProfile);
          });
        }

        setUsers(resultUsers);
      } catch (error) {
        console.error("Error fetching users for list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, userIds, firestore]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-lg font-black uppercase tracking-tighter">{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-4 py-4">
              {users.map((user) => (
                <Link 
                  key={user.uid} 
                  href={`/profile/${user.username}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-2xl transition-colors group"
                >
                  <Avatar className="h-10 w-10 border border-primary/10">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-subheadline text-sm font-black group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="font-subheadline text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-subheadline text-sm text-muted-foreground italic">Daftar kosong.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
