"use client";

import Image from "next/image";
import type { PetType, PetMood } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

type PetDisplayProps = {
  petType: PetType;
  petName: string;
  mood: PetMood;
  onPetChange: (petType: PetType) => void;
};

const petImages: Record<PetType, Record<PetMood, { src: string; hint: string }>> = {
  dog: {
    idle: { src: "/home/user/studio/src/components/images/IMG_20250802_111452.jpg", hint: "dog sitting" },
    happy: { src: "https://placehold.co/600x600", hint: "happy dog" },
    sad: { src: "https://placehold.co/600x600", hint: "sad dog" },
    energetic: { src: "https://placehold.co/600x600", hint: "dog running" },
  },
  cat: {
    idle: { src: "https://placehold.co/600x400", hint: "cat sitting" },
    happy: { src: "https://placehold.co/600x400", hint: "happy cat" },
    sad: { src: "https://placehold.co/600x400", hint: "sad cat" },
    energetic: { src: "https://placehold.co/600x400", hint: "cat playing" },
  },
  dragon: {
    idle: { src: "https://placehold.co/600x400", hint: "dragon resting" },
    happy: { src: "https://placehold.co/600x400", hint: "happy dragon" },
    sad: { src: "https://placehold.co/600x400", hint: "sad dragon" },
    energetic: { src: "https://placehold.co/600x400", hint: "dragon flying" },
  },
};

export default function PetDisplay({ petType, petName, mood, onPetChange }: PetDisplayProps) {
  const petImage = petImages[petType][mood];

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden relative">
       <CardHeader className="absolute top-0 left-4 z-10 bg-background/80 p-2 rounded-lg">
        <CardTitle className="text-xl font-bold text-primary">{petName}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="absolute top-4 right-4 z-10 w-40 bg-background/80 p-2 rounded-lg">
          <Label htmlFor="pet-select" className="text-xs mb-1 block">Choose Pet</Label>
          <Select value={petType} onValueChange={(value: PetType) => onPetChange(value)}>
            <SelectTrigger id="pet-select" className="w-full h-9">
              <SelectValue placeholder="Select a pet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="dragon">Dragon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="aspect-video w-full flex items-center justify-center bg-secondary/50">
           <Image
            key={petType + mood}
            src={petImage.src}
            alt={`${mood} ${petType}`}
            width={600}
            height={400}
            data-ai-hint={petImage.hint}
            className="object-cover w-full h-full animate-in fade-in-50 duration-500"
            priority
          />
        </div>
      </CardContent>
    </Card>
  );
}
