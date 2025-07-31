
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

type FriendChallengeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const mockFriends = [
  { name: "Alice", avatar: "https://placehold.co/40x40" },
  { name: "Bob", avatar: "https://placehold.co/40x40" },
  { name: "Charlie", avatar: "https://placehold.co/40x40" },
  { name: "Diana", avatar: "https://placehold.co/40x40" },
];

export default function FriendChallengeModal({ isOpen, onClose }: FriendChallengeModalProps) {
  const { toast } = useToast();

  const handleChallenge = (name: string) => {
    // Placeholder for confetti/sparkle animation
    console.log(`Challenging ${name}`);
    
    toast({
      title: "Challenge Sent!",
      description: `Your challenge has been sent to ${name}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="sm:max-w-md"
          >
            <DialogHeader>
              <DialogTitle>Challenge a Friend</DialogTitle>
              <DialogDescription>
                Send a friendly challenge to see who can keep up their habits!
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
                {mockFriends.map((friend) => (
                    <div key={friend.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="user avatar" />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{friend.name}</span>
                        </div>
                        <Button size="sm" onClick={() => handleChallenge(friend.name)}>
                           <Send className="mr-2" />
                            Challenge
                        </Button>
                    </div>
                ))}
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
