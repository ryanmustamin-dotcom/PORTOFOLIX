
'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

interface MessageDialogProps {
  receiverUid: string;
  receiverName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MessageDialog({ receiverUid, receiverName, isOpen, onOpenChange }: MessageDialogProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!auth.currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Anda harus masuk untuk mengirim pesan.' });
      return;
    }
    if (!text.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(firestore, 'messages'), {
        senderUid: auth.currentUser.uid,
        receiverUid: receiverUid,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Pesan terkirim!', description: `Pesan Anda telah dikirim ke ${receiverName}.` });
      setText('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ variant: 'destructive', title: 'Gagal mengirim pesan', description: 'Terjadi kesalahan teknis.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kirim Pesan ke {receiverName}</DialogTitle>
          <DialogDescription>Tulis pesan atau pertanyaan Anda di bawah ini.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea 
            placeholder="Ketik pesan Anda di sini..." 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSendMessage} disabled={loading || !text.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Kirim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
