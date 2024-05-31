"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

import { CartBridge } from "./bridge";

console.log(CartBridge.toString().replace(/^\(\)\w*=>\w*\{?|\}$/g, ""))

const LoadAndPatchPico8Cart = (cart: string) => {
  return URL.createObjectURL(
    new Blob([
      `globalThis.runCartScript=(Module)=>{${cart}};` +
        CartBridge.toString().replace(/^\(\)\w*=>\w*\{?|\}$/g, ""),
    ])
  );
}

const Pico8Canvas = ({ cart, resolution }: { cart?: string, resolution: number }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const state = useRef<{
    offscreen: OffscreenCanvas | null;
    worker: Worker | null;
    attached: boolean;
  }>({
    offscreen: null,
    worker: null,
    attached: false,
  });
  useEffect(() => {
    if (!cart || !canvasRef.current || state.current.attached) {
      return;
    }
    state.current.attached = true;
    state.current.offscreen = canvasRef.current.transferControlToOffscreen();
    state.current.worker = new Worker(cart ?? "");
    state.current.worker.postMessage(
      { cmd: "init", canvas: state.current.offscreen },
      [state.current.offscreen]
    );

    return () => {
      // state.current.worker?.terminate()
    };
  }, [cart]);

  return (
    <canvas
      ref={canvasRef}
      width="128"
      height="128"
      style={{
        width: resolution,
        height: resolution,
        imageRendering: 'pixelated',
        background: 'black'
      }}
    ></canvas>
  );
};

export const Pico8Chaos = () => {
  const [resolution, setResolution] = useState(256);
  const [instanceCount, setInstanceCount] = useState(1);
  const [cartId, setCartId] = useState<number>(0);
  const [cart, setCart] = useState<string>("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 gap-4">
      <header className="flex z-10 w-full gap-2 font-mono text-sm">
        <div className="flex w-auto justify-center border py-4 px-6 border-neutral-800 bg-zinc-800/30 static rounded-xl items-center font-black">
          react-pico8-chaos
        </div>
        <div className="flex flex-col w-auto justify-center border p-4 border-neutral-800 bg-zinc-800/30 static rounded-xl">
          <Label htmlFor="instances" className="mb-2">
            Instances
          </Label>
          <Input
            min="0"
            max="256"
            id="instances"
            type="number"
            value={instanceCount}
            onChange={(e) => {
              setInstanceCount(Number(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col w-auto justify-center border p-4 border-neutral-800 bg-zinc-800/30 static rounded-xl">
          <Label htmlFor="cartjs" className="mb-2">
            Cart JS File
          </Label>
          <Input id="cartjs" type="file" onChange={(e) =>{
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader();
              reader.addEventListener('load', (event) => {
                if(event.target?.result) {
                  setCart(LoadAndPatchPico8Cart(event.target.result as string))
                  setCartId(cartId + 1);
                }
              });
              reader.readAsText(file);
            }
          }} />
        </div>
        <div className="flex flex-col w-auto justify-center border p-4 border-neutral-800 bg-zinc-800/30 static rounded-xl">
          <Label htmlFor="resolution" className="mb-2">
            Resolution
          </Label>
          <Input
            min="1"
            max="1024"
            id="resolution"
            type="number"
            value={resolution}
            onChange={(e) => {
              setResolution(Number(e.target.value));
            }}
          />
        </div>
      </header>
      <div className="grid grow w-full gap-1" style={{
        gridTemplateColumns: `repeat(auto-fill, ${resolution}px)`,
        gridAutoRows: `min-content`
      }}>
        {[...Array(instanceCount)].map((_, index) => (
          <Pico8Canvas key={`${cartId}-${index}`} cart={cart} resolution={resolution} />
        ))}
      </div>
    </main>
  );
};
