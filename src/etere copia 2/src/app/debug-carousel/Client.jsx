"use client";

import { useEffect } from "react";
import { ContentProvider } from "../../context/ContentContext";
import Carousel from "../../components/Carousel/Carousel";

export default function DebugCarouselClient() {
    /* 1️⃣ appena la pagina è montata fingo l'attivazione */
    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("sectionActivated", {
                detail: { id: "carousel", reset: true },
            })
        );
    }, []);

    /* 2️⃣ niente flex‑center, lasciamo il Carousel occupare il 100 % */
    return (
        <ContentProvider>
            <main
                style={{
                    width: "100%",
                    minHeight: "100vh",
                    background: "#000",
                    overflow: "hidden",
                }}
            >
                <Carousel />
            </main>
        </ContentProvider>
    );
}
