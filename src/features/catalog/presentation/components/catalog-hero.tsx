"use client";

import Image from "next/image";

export function CatalogHero() {
  return (
    <section className="relative h-[300px] overflow-hidden bg-[#080808] md:h-[370px]">
      <Image
        src="/assets/hero-clothing.png"
        alt="Looks de roupas sem rostos identificaveis"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.94),rgba(0,0,0,.28)_50%,transparent_75%)]" />
      <div className="absolute left-[18px] top-[46px] z-10 text-white md:left-[30px] md:top-[55px]">
        <span className="text-[11px] font-black text-[var(--color-lime)]">COLECAO DA SEMANA</span>
        <h1 className="my-[17px] font-display text-[48px] font-normal leading-[0.82] md:text-[68px]">
          NOVA COLECAO.
          <br />
          SEU ESTILO.
        </h1>
        <p className="text-[12px] leading-[1.35] md:text-[15px]">
          Pecas para montar looks com
          <br />
          identidade, conforto e
          <br />
          presenca no dia a dia.
        </p>
        <button
          className="mt-5 bg-[var(--color-lime)] px-[21px] py-3 text-[11px] font-black text-black"
          onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
        >
          VER PRODUTOS
        </button>
      </div>
    </section>
  );
}
