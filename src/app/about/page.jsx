"use client";

import { useContent } from "../../context/ContentContext";
import "../home.css";

const team = [
    {
        name: "Pierluigi Raffone",
        role: "CEO",
        image: "/images/team/pierluigi.jpg", // Sostituisci con il path reale
        background: [
            "Tech Lead in 4+ Start-Ups and Agencies"
        ],
        education: [
            "Researcher - University of California, Berkeley",
            "Master in Electronic Engineering - Politecnico di Milano"
        ]
    },
    {
        name: "Andrea Sanvido",
        role: "Business Development",
        image: "/images/team/andrea.jpg", // Sostituisci con il path reale
        background: [
            "Product Strategy - Revolut"
        ],
        education: [
            "Master in Finance - ESCP"
        ]
    },
    {
        name: "Giuseppe Maiarù",
        role: "CTO",
        image: "/images/team/giuseppe.jpg", // Sostituisci con il path reale
        background: [
            "Tech Lead"
        ],
        education: []
    }
];

export default function AboutPage() {
    const { home } = useContent();

    return (
        <main className="about-page">
            <section className="about-hero">
                <div className="about-caption-large">
                    We master Flutter architectures for custom products and great experience across mobile, web and embedded systems.
                </div>
                <p className="about-lead">
                    {home.hero.caption}
                </p>
            </section>
            <section className="about-team">
                <h2>Meet the Team</h2>
                <div className="team-cards">
                    {team.map(member => (
                        <div className="team-card" key={member.name}>
                            <div className="team-photo">
                                <img src={member.image} alt={member.name} />
                            </div>
                            <h3>{member.name}</h3>
                            <p className="team-role">{member.role}</p>
                            <div className="team-section">
                                <strong>Professional Background:</strong>
                                <ul>
                                    {member.background.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            {member.education.length > 0 && (
                                <div className="team-section">
                                    <strong>Education Background:</strong>
                                    <ul>
                                        {member.education.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
} 