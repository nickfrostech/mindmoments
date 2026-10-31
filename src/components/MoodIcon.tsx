/** @format */

import React from "react";
import { Target, Moon, Zap, HelpCircle } from "lucide-react";
import { MoodType } from "../types/memory";

interface MoodIconProps {
	mood: MoodType;
	className?: string;
}

export function MoodIcon({ mood, className = "w-3.5 h-3.5" }: MoodIconProps) {
	switch (mood) {
		case "focused":
			return <Target className={className} />;
		case "fatigued":
			return <Moon className={className} />;
		case "breakthrough":
			return <Zap className={className} />;
		case "uncertain":
			return <HelpCircle className={className} />;
		default:
			return <Target className={className} />;
	}
}
