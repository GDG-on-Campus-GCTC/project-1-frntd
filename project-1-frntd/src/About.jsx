import React from 'react';
import BackButton from './components/BackButton';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <BackButton />
            <div className="about-container">
                <div className="about-content">
                    {/* Hero Section */}
                    <section className="about-hero">
                        <h1 className="about-title">About GCTC Study Hub</h1>
                        <p className="about-subtitle">
                            Your AI-powered companion for GCTC exam preparation
                        </p>
                    </section>

                    {/* Project Overview */}
                    <section className="about-section">
                        <h2 className="section-title">Project Overview</h2>
                        <div className="section-content">
                            <p>
                                <strong>GCTC Study Hub</strong> is a one-stop platform designed to help students prepare effectively for GCTC exams by providing access to study questions and materials powered by artificial intelligence.
                            </p>
                            <p>
                                Our lightweight AI model is trained exclusively on last year's and previous GCTC exam papers, ensuring that every answer is grounded in the institute's own corpus. This approach guarantees relevance, accuracy, and reduces dependency on external tools that may not align with your specific curriculum.
                            </p>
                        </div>
                    </section>

                    {/* Technology */}
                    <section className="about-section">
                        <h2 className="section-title">Technology</h2>
                        <div className="section-content">
                            <p>
                                GCTC Study Hub is built with modern web technologies:
                            </p>
                            <ul className="tech-list">
                                <li>React + TypeScript for a fast, type-safe user interface</li>
                                <li>Node.js server handling requests and business logic</li>
                                <li>Python-based AI pipeline for embeddings and intelligent retrieval</li>
                                <li>Streaming responses with visible citations for transparency</li>
                            </ul>
                        </div>
                    </section>

                    {/* Community */}
                    <section className="about-section">
                        <h2 className="section-title">Built by the Community</h2>
                        <div className="section-content">
                            <p>
                                This project is developed and maintained by the <strong>Google Developer Group (GDG) on Campus — GCTC tech team</strong>.
                            </p>
                            <p>
                                GDG on Campus — GCTC is a student-led community focused on collaborative learning in software and cloud technologies. Our mission is to transform classroom concepts into working projects through peer teaching, guided workshops, and mentorship.
                            </p>
                        </div>
                    </section>
                    {/* Disclaimer Section */}
                    <section className="disclaimer-section">
                        <div className="disclaimer-content">
                            <h3 className="disclaimer-title">Disclaimer</h3>
                            <p className="disclaimer-text">
                                GDG on Campus GCTC is an independent group; our activities and the opinions expressed here should in no way be linked to Google, the corporation. To learn more about the GDG program, visit{' '}
                                <a
                                    href="https://developers.google.com/community/gdg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="disclaimer-link"
                                >
                                    developers.google.com/community/gdg
                                </a>
                            </p>
                        </div>
                    </section>
                    {/* Footer */}
                    <section className="about-footer">
                        <p>© 2025 GDG on Campus GCTC. Built for students, by students.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
