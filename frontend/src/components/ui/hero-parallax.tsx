"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface ProductType {
  title: string;
  link: string;
  thumbnail: string;
  description: string;
}

export interface HeroParallaxProps {
  products: ProductType[];
}

export const HeroParallax = ({ products }: HeroParallaxProps) => {
  const firstRow = products.slice(0, 3);
  const secondRow = products.slice(1, 4);
  const thirdRow = products.slice(2, 5);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-center text-white text-shadow-lg">
        LNMIIT Major Events
      </h1>
      <p className="text-base md:text-xl mt-8 text-center text-white max-w-3xl mx-auto text-shadow-md">
        Experience LNMIIT's flagship events - celebrating technology, culture,
        and sports excellence on a national stage.
      </p>
    </div>
  );
};

interface ProductCardProps {
  product: ProductType;
  translate: MotionValue<number>;
}

export const ProductCard = ({ product, translate }: ProductCardProps) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0 shadow-2xl border-2 border-white/10 rounded-xl overflow-hidden"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={product.title}
        />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black via-black/70 to-black/20 opacity-80 group-hover/product:opacity-90 transition duration-500"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <h2 className="font-bold text-3xl text-white text-shadow-lg">
            {product.title}
          </h2>
          <p className="text-white/90 text-xl text-shadow-md">
            {product.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
