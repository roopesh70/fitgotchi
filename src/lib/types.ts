import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type PetType = "dog" | "cat" | "dragon";
export type PetMood = "idle" | "happy" | "sad" | "energetic";

export type HabitID = "water" | "sleep" | "steps" | "meals" | "screenTime";

export type Habit = {
  id: HabitID;
  name: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  goal: number;
  unit: string;
  progress: number;
};

export type Habits = {
  [key in HabitID]: Habit;
};
