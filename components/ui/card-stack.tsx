"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

let interval: any;

type Card = {
  id: number;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  const moveNext = () => {
    clearInterval(interval);
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
    // Restart auto-flip after interaction
    startFlipping();
  };

  const movePrev = () => {
    clearInterval(interval);
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.push(newArray.shift()!);
      return newArray;
    });
    startFlipping();
  };

  return (
    <div className="relative h-96 w-full md:h-[35rem] md:w-[40rem]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute dark:bg-black bg-white h-96 w-full md:h-[30rem] md:w-[40rem] rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200 h-full">
              {card.content}
            </div>
          </motion.div>
        );
      })}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4 z-[100]">
        <Button 
            variant="outline" 
            size="icon" 
            onClick={movePrev}
            className="rounded-full bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
            variant="outline" 
            size="icon" 
            onClick={moveNext}
            className="rounded-full bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
            <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
