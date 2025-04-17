"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Frame from "./components/home/frame";
import Middle from "./components/home/middle";
import Integeration from "./components/home/intigration";

const StackingCards = () => {
  useEffect(() => {
    if (!CSS.supports("animation-timeline: scroll()")) {
      console.warn("Scroll-driven animations not supported in this browser");
    }
  }, []);

  return (
    <div className="bg-[#000306] text-white text-center text-[calc(1em+0.5vw)]">
      <input type="checkbox" id="debug" className="hidden" />

      {/* Radial gradient background */}

      <div className="absolute w-full h-[100vh] flex justify-center items-center bg-[#000306] ">
        {/* Radial Gradient Background */}
        <div className="absolute w-[100%] h-[100%] mix-blend-screen bg-[radial-gradient(circle_at_center,_#1c6ebf,_#050b1d_20%,_#000_70%)] z-0" />

        {/* Grid Image Overlay */}
        <div className="absolute w-[70%] h-[70%] z-10 blur-edge-mask">
          <Image
            src="/images/image1.svg"
            alt="grid background"
            fill
            className="object-cover opacity-10  mix-blend-screen pointer-events-none"
          />
        </div>

        {/* Centered Content (if any) */}
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold">cube.io</div>
        <div className="space-x-6 hidden sm:flex">
          <a href="#features" className="hover:text-gray-300">
            Features
          </a>
          <a href="#pricing" className="hover:text-gray-300">
            Pricing
          </a>
          <button className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative  mt-[10vh] z-10 flex flex-col items-center justify-center text-center px-4 py-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
          Learning 3D is Never <br className="hidden sm:block" /> Been Easier
        </h1>
        <p className="text-gray-300 max-w-xl text-lg mb-8">
          Explore the world of 3D designed for beginners. Making the creative
          process enjoyable and accessible to everyone.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200">
            Try Cube.io for Free
          </button>
          <button className="border border-blue-400 px-6 py-3 rounded-full text-blue-400 hover:bg-blue-500 hover:text-white">
            See Examples →
          </button>
        </div>
      </div>

      <main className="w-[80vw] mx-auto">
        <ul
          id="cards"
          className="pb-[calc(var(--numcards)*var(--card-top-offset))] mb-[var(--card-margin)] grid grid-cols-1 gap-[var(--card-margin)]"
          style={{
            ["--card-height"]: "40vw",
            ["--card-margin"]: "4vw",
            ["--card-top-offset"]: "1em",
            ["--numcards"]: 4,
            ["--outline-width"]: "0px",
          }}
        >
          <li
            key="1"
            id={"1"}
            className="card sticky top-0 pt-[calc(var(--index)*var(--card-top-offset))]"
            style={{ ["--index"]: 1 }}
          >
            <div className="card__content shadow-md  overflow-hidden ">
              <figure className="overflow-hidden">
                <Image
                  src={`/images/3d_img.jpeg`}
                  alt={`Image for Card 1`}
                  width={1000}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>
          </li>
          <li
            key="2"
            id={"2"}
            className="card sticky top-0 pt-[calc(var(--index)*var(--card-top-offset))]"
            style={{ ["--index"]: 2 }}
          >
            <div className="card__content shadow-md  overflow-hidden ">
              <figure className="overflow-hidden">
                <Image
                  src={`/images/3d_img.jpeg`}
                  alt={`Image for Card 2`}
                  width={1000}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>
          </li>
          <li
            key="3"
            id={"3"}
            className="card sticky top-0 pt-[calc(var(--index)*var(--card-top-offset))]"
            style={{ ["--index"]: 3 }}
          >
            <div className="card__content shadow-md  overflow-hidden ">
              <figure className="overflow-hidden">
                <Image
                  src={`/images/map_img.png`}
                  alt={`Image for Card 3`}
                  width={1000}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>
          </li>
        </ul>
      </main>

      {/* <aside className="w-[50vw] mx-auto text-left">
        {[1, 2, 3, 4].map((para) => (
          <p key={para} className="mb-[1em]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem repellat non ratione eum provident quaerat obcaecati dicta autem voluptates sit cum quis distinctio, atque sint commodi reprehenderit perspiciatis iure velit molestiae eos molestias ipsa nihil quia? Porro tempore in fugit, aspernatur et temporibus aliquam magnam adipisci deleniti dicta repellat alias nostrum impedit quidem odit excepturi nam.
          </p>
        ))}
      </aside> */}

      <Frame />
      <Middle />
      <Integeration />

      <style jsx global>{`
        @supports (animation-timeline: scroll()) {
          .card {
            --index0: calc(var(--index) - 1);
            --reverse-index: calc(var(--numcards) - var(--index0));
            --reverse-index0: calc(var(--reverse-index) - 1);
          }

          .card__content {
            transform-origin: 50% 0%;
            will-change: transform;
            --duration: calc(var(--reverse-index0) * 1s);
            --delay: calc(var(--index0) * 1s);
            animation: var(--duration) linear scale var(--delay) forwards;
            animation-timeline: scroll(root);
          }

          @keyframes scale {
            to {
              transform: scale(calc(1.1 - (0.1 * var(--reverse-index))));
            }
          }
        }

        #debug:checked ~ main {
          --outline-width: 1px;
        }

        .card {
          outline: var(--outline-width) solid hotpink;
        }

        #cards {
          outline: calc(var(--outline-width) * 10) solid blue;
          grid-template-rows: repeat(var(--numcards), var(--card-height));
        }

        .card__content {
          outline: var(--outline-width) solid lime;
        }
      `}</style>
    </div>
  );
};

export default StackingCards;
