"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import type { PetType, PetMood, Habits, Habit } from "@/lib/types";
import { generateEncouragingMessage } from "@/ai/flows/generate-encouraging-messages";
import type { GenerateEncouragingMessageInput } from "@/ai/flows/generate-encouraging-messages";

import {
  GlassWater,
  BedDouble,
  Footprints,
  CookingPot,
  Smartphone,
  Star,
  Sparkles,
} from "lucide-react";

import Header from "@/components/Header";
import PetDisplay from "@/components/PetDisplay";
import HabitTracker from "@/components/HabitTracker";
import EncouragementCard from "@/components/EncouragementCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialHabits: Habits = {
  water: {
    id: "water",
    name: "Water Intake",
    icon: GlassWater,
    goal: 8,
    unit: "glasses",
    progress: 0,
  },
  sleep: {
    id: "sleep",
    name: "Sleep",
    icon: BedDouble,
    goal: 8,
    unit: "hours",
    progress: 0,
  },
  steps: {
    id: "steps",
    name: "Steps",
    icon: Footprints,
    goal: 10000,
    unit: "steps",
    progress: 0,
  },
  meals: {
    id: "meals",
    name: "Healthy Meals",
    icon: CookingPot,
    goal: 3,
    unit: "meals",
    progress: 0,
  },
  screenTime: {
    id: "screenTime",
    name: "Screen Time",
    icon: Smartphone,
    goal: 2,
    unit: "hours",
    progress: 0,
  },
};

export default function Home() {
  const [petType, setPetType] = useState<PetType>("dog");
  const [petMood, setPetMood] = useState<PetMood>("idle");
  const [habits, setHabits] = useState<Habits>(initialHabits);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(100);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getEncouragement = async (
    habit: Habit,
    currentStreak: number
  ) => {
    startTransition(async () => {
      const input: GenerateEncouragingMessageInput = {
        habitType: habit.name,
        habitGoal: `${habit.goal} ${habit.unit}`,
        habitProgress: habit.progress,
        streakLength: currentStreak,
      };
      const result = await generateEncouragingMessage(input);
      setEncouragement(result.message);
    });
  };

  const updatePetMood = useCallback(() => {
    const completedHabits = Object.values(habits).filter(
      (h) => h.progress >= h.goal
    ).length;
    const totalHabits = Object.values(habits).length;
    const completionRatio = completedHabits / totalHabits;

    if (completionRatio >= 0.8) {
      setPetMood("happy");
    } else if (completionRatio >= 0.4) {
      setPetMood("energetic");
    } else if (completionRatio > 0) {
      setPetMood("idle");
    } else {
      setPetMood("sad");
    }
  }, [habits]);

  useEffect(() => {
    updatePetMood();
  }, [habits, updatePetMood]);

  const handleLogHabit = (habitId: keyof Habits, value: number) => {
    const updatedHabits = { ...habits };
    const habit = updatedHabits[habitId];
    const newProgress = habit.progress + value;
    const wasCompleted = habit.progress >= habit.goal;
    habit.progress = Math.max(0, newProgress);
    const isCompleted = habit.progress >= habit.goal;

    setHabits(updatedHabits);

    if (isCompleted && !wasCompleted) {
      const newCoins = coins + 10;
      setCoins(newCoins);
      const newStreak = streak + 1;
      setStreak(newStreak);
      getEncouragement(habit, newStreak);
    }
  };

  const handleSetHabit = (habitId: keyof Habits, value: number) => {
    const updatedHabits = { ...habits };
    const habit = updatedHabits[habitId];
    const wasCompleted = habit.progress >= habit.goal;
    habit.progress = Math.max(0, value);
    const isCompleted = habit.progress >= habit.goal;

    setHabits(updatedHabits);

    if (isCompleted && !wasCompleted) {
      const newCoins = coins + 10;
      setCoins(newCoins);
      const newStreak = streak + 1;
      setStreak(newStreak);
      getEncouragement(habit, newStreak);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header streak={streak} coins={coins} />
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 lg:w-3/5 flex flex-col gap-8">
          <PetDisplay
            petType={petType}
            mood={petMood}
            onPetChange={setPetType}
          />
          {encouragement && <EncouragementCard message={encouragement} isPending={isPending} />}
        </div>
        <div className="md:w-1/2 lg:w-2/5 flex flex-col gap-8">
          <HabitTracker
            habits={habits}
            onLogHabit={handleLogHabit}
            onSetHabit={handleSetHabit}
          />
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-yellow-400" />
                Rewards & Fun
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button disabled variant="outline" className="h-12">Pet Customization</Button>
              <Button disabled variant="outline" className="h-12">Mini-Games</Button>
              <Button disabled variant="outline" className="h-12">Leaderboards</Button>
              <Button disabled variant="outline" className="h-12">Friend Challenges</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
