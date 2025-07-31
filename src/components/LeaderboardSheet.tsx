
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, Trophy } from "lucide-react";

type LeaderboardSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

const mockLeaderboard = [
  { rank: 1, name: "Alice", streak: 128, avatar: "https://placehold.co/40x40" },
  { rank: 2, name: "You", streak: 92, avatar: "https://placehold.co/40x40" },
  { rank: 3, name: "Bob", streak: 85, avatar: "https://placehold.co/40x40" },
  { rank: 4, name: "Charlie", streak: 70, avatar: "https://placehold.co/40x40" },
  { rank: 5, name: "Diana", streak: 68, avatar: "https://placehold.co/40x40" },
  { rank: 6, name: "Ethan", streak: 55, avatar: "https://placehold.co/40x40" },
  { rank: 7, name: "Fiona", streak: 42, avatar: "https://placehold.co/40x40" },
];

const rowVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i:number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function LeaderboardSheet({ isOpen, onClose }: LeaderboardSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <SheetContent
             side="right"
             className="w-full sm:max-w-md"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Trophy className="text-primary" />
                Leaderboard
              </SheetTitle>
              <SheetDescription>
                See how you stack up against your friends.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-border">
                {mockLeaderboard.map((user, i) => (
                  <motion.li
                    key={user.rank}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="py-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-6 text-center text-lg font-bold text-muted-foreground">
                        {user.rank}
                      </div>
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-medium ${user.name === 'You' ? 'text-primary' : 'text-foreground'}`}>
                          {user.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-orange-500">
                        <Flame className="h-4 w-4" />
                        {user.streak}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </SheetContent>
        )}
      </AnimatePresence>
    </Sheet>
  );
}
