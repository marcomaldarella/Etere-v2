"use client";

import { useEffect } from "react";
import "./contact.css";

const CALENDLY_URL = "https://calendly.com/pier-eterestudio/30min";

// FUNZIONE CORRETTA: con blur + cleanup
const openCalendly = () => {
    document.body.classList.add("blurred");

    window.Calendly?.initPopupWidget({
        url: CALENDLY_URL,
        prefill: {},
        utm: {}
    });

    const interval = setInterval(() => {
        const overlay = document.querySelector(".calendly-overlay");
        if (!overlay) {
            document.body.classList.remove("blurred");
            clearInterval(interval);
        }
    }, 500);
};

export default function ContactPage() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!window.Calendly) {
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = "https://assets.calendly.com/assets/external/widget.css";
            document.head.appendChild(css);

            const js = document.createElement("script");
            js.src = "https://assets.calendly.com/assets/external/widget.js";
            js.async = true;
            document.body.appendChild(js);
        }
    }, []);

    return (
        <main className="contact-final-hero">
            <div className="final-hero-content">
                <h2 className="final-hero-title">Let’s build something great</h2>
                <p className="final-hero-text contact-address">
                    info@eterestudio.co
                </p>
                <div className="contact-cta-buttons">
                    <a
                        href="mailto:info@eterestudio.co"
                        className="final-hero-cta"
                        aria-label="Write us"
                    >
                        Write&nbsp;us
                    </a>
                    <button
                        type="button"
                        className="final-hero-cta"
                        onClick={openCalendly}
                        aria-label="Book a call on Calendly"
                    >
                        Book&nbsp;a&nbsp;call
                    </button>
                </div>
            </div>
        </main>
    );
}
