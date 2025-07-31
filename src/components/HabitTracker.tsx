"use client";

import type { Habits, HabitID } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type HabitTrackerProps = {
  habits: Habits;
  onLogHabit: (habitId: HabitID, value: number) => void;
  onSetHabit: (habitId: HabitID, value: number) => void;
};

export default function HabitTracker({
  habits,
  onLogHabit,
  onSetHabit,
}: HabitTrackerProps) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Daily Habits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.values(habits).map((habit) => (
          <div key={habit.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <habit.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{habit.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {habit.progress} / {habit.goal} {habit.unit}
              </span>
            </div>
            <Progress
              value={(habit.progress / habit.goal) * 100}
              className="h-3"
            />
            <div className="flex items-center gap-2 pt-1">
              {habit.id === "sleep" || habit.id === "screenTime" || habit.id === 'steps' ? (
                <div className="flex-grow flex gap-2">
                  <Input 
                    type="number"
                    placeholder={`Set ${habit.unit}`}
                    className="h-9"
                    onChange={(e) => onSetHabit(habit.id, Number(e.target.value))}
                  />
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onLogHabit(habit.id, -1)}
                    aria-label={`Decrease ${habit.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onLogHabit(habit.id, 1)}
                    aria-label={`Increase ${habit.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {habit.id === 'meals' && (
                     <Button className="flex-grow h-9" onClick={() => onLogHabit(habit.id, 1)}>Log Healthy Meal</Button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
