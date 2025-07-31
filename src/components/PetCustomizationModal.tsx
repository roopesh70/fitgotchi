
"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, Lock } from "lucide-react";
import Image from "next/image";

type PetCustomizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  onPetNameChange: (name: string) => void;
  coins: number;
  onPurchase: (cost: number) => void;
};

const skins = [
  { name: "Golden", cost: 50, src: "https://placehold.co/150x150", hint:"golden pet skin" },
  { name: "Galaxy", cost: 100, src: "https://placehold.co/150x150", hint:"galaxy pet skin" },
  { name: "Zombie", cost: 150, src: "https://placehold.co/150x150", hint:"zombie pet skin" },
];

const outfits = [
  { name: "Bowtie", cost: 20, src: "https://placehold.co/150x150", hint:"pet with bowtie" },
  { name: "Top Hat", cost: 30, src: "https://placehold.co/150x150", hint:"pet with top hat" },
  { name: "Superhero Cape", cost: 75, src: "https://placehold.co/150x150", hint:"pet with superhero cape" },
];

export default function PetCustomizationModal({
  isOpen,
  onClose,
  petName,
  onPetNameChange,
  coins,
  onPurchase,
}: PetCustomizationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="sm:max-w-[480px]"
          >
            <DialogHeader>
              <DialogTitle>Customize Your Pet</DialogTitle>
              <DialogDescription>
                Use your coins to unlock new looks for your companion.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="skins">Skins</TabsTrigger>
                <TabsTrigger value="outfits">Outfits</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pet-name">Pet's Name</Label>
                    <Input
                      id="pet-name"
                      value={petName}
                      onChange={(e) => onPetNameChange(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skins" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {skins.map((skin) => (
                    <Card key={skin.name} className="overflow-hidden">
                      <CardContent className="p-0 text-center">
                        <div className="aspect-square bg-secondary flex items-center justify-center">
                          <Image src={skin.src} alt={skin.name} width={150} height={150} data-ai-hint={skin.hint} />
                        </div>
                        <div className="p-2">
                          <h3 className="font-semibold">{skin.name}</h3>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            disabled={coins < skin.cost}
                            onClick={() => onPurchase(skin.cost)}
                          >
                            {coins < skin.cost ? <Lock className="mr-2 h-4 w-4"/> : <CircleDollarSign className="mr-2 h-4 w-4" />}
                            {skin.cost}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="outfits" className="mt-4">
                 <div className="grid grid-cols-2 gap-4">
                  {outfits.map((outfit) => (
                    <Card key={outfit.name} className="overflow-hidden">
                      <CardContent className="p-0 text-center">
                        <div className="aspect-square bg-secondary flex items-center justify-center">
                           <Image src={outfit.src} alt={outfit.name} width={150} height={150} data-ai-hint={outfit.hint} />
                        </div>
                        <div className="p-2">
                          <h3 className="font-semibold">{outfit.name}</h3>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            disabled={coins < outfit.cost}
                            onClick={() => onPurchase(outfit.cost)}
                          >
                            {coins < outfit.cost ? <Lock className="mr-2 h-4 w-4"/> : <CircleDollarSign className="mr-2 h-4 w-4" />}
                            {outfit.cost}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <div className="flex items-center gap-2 font-semibold">
                Your Coins: <CircleDollarSign className="text-green-500 h-5 w-5"/> {coins}
              </div>
              <Button onClick={onClose}>Done</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
