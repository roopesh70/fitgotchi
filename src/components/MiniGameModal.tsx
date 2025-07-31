
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bone, Fish, Apple, Carrot, Heart, Star, HelpCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [
  { id: 1, icon: Bone },
  { id: 2, icon: Fish },
  { id: 3, icon: Apple },
  { id: 4, icon: Carrot },
  { id: 5, icon: Heart },
  { id: 6, icon: Star },
];

const createGameBoard = () => {
  const gameIcons = [...icons, ...icons];
  return gameIcons.sort(() => Math.random() - 0.5).map((item, index) => ({
    ...item,
    uniqueId: index,
    isFlipped: false,
    isMatched: false,
  }));
};

type CardType = {
  id: number;
  icon: React.ElementType;
  uniqueId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

type MiniGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGameWin: () => void;
};

export default function MiniGameModal({ isOpen, onClose, onGameWin }: MiniGameModalProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen]);

  const resetGame = () => {
    setCards(createGameBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsGameWon(false);
  };

  const handleCardClick = (clickedCard: CardType) => {
    if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    const newCards = cards.map(card => 
      card.uniqueId === clickedCard.uniqueId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlippedCards;
      if (firstCard.id === secondCard.id) {
        // Match
        const matchedCards = newCards.map(card =>
          card.id === firstCard.id ? { ...card, isMatched: true, isFlipped: true } : card
        );
        setCards(matchedCards);
        setFlippedCards([]);

        if(matchedCards.every(c => c.isMatched)) {
            setIsGameWon(true);
        }

      } else {
        // No match
        setTimeout(() => {
          const resetFlipped = newCards.map(card =>
            !card.isMatched ? { ...card, isFlipped: false } : card
          );
          setCards(resetFlipped);
          setFlippedCards([]);
        }, 1000);
      }
    }
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
            className="sm:max-w-lg"
          >
            <DialogHeader>
              <DialogTitle>Memory Match</DialogTitle>
              <DialogDescription>
                Find all the matching pairs! You get 50 coins for winning.
              </DialogDescription>
            </DialogHeader>

            {isGameWon ? (
                 <div className="flex flex-col items-center justify-center p-8 text-center bg-green-100/50 rounded-lg">
                    <Award className="w-16 h-16 text-primary mb-4"/>
                    <h2 className="text-2xl font-bold mb-2">You Won!</h2>
                    <p>You earned 50 coins! Your pet is very happy.</p>
                    <Button className="mt-6" onClick={onGameWin}>Claim Reward</Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-4 gap-4 p-4">
                    {cards.map((card) => (
                        <motion.div
                        key={card.uniqueId}
                        onClick={() => handleCardClick(card)}
                        className="cursor-pointer"
                        initial={false}
                        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        >
                        <div className="w-full h-full absolute" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                            <Card className="w-full h-full flex items-center justify-center bg-secondary">
                                <HelpCircle className="w-8 h-8 text-secondary-foreground"/>
                            </Card>
                        </div>
                        <div className="w-full h-full absolute" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                             <Card className={cn(
                                "w-full h-full flex items-center justify-center",
                                card.isMatched ? "bg-primary/20 border-primary" : "bg-card"
                             )}>
                                <card.icon className="w-8 h-8 text-primary"/>
                            </Card>
                        </div>
                        <div className="aspect-square w-full" />
                        </motion.div>
                    ))}
                    </div>
                     <DialogFooter className="flex-row justify-between items-center w-full">
                        <p className="text-sm text-muted-foreground">Moves: {moves}</p>
                        <Button variant="outline" onClick={resetGame}>Reset Game</Button>
                    </DialogFooter>
                </>
            )}
           
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
