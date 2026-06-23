import { Container } from 'react-bootstrap'

const AboutScreen = () => {
    return (
        <main style={{ padding: '2rem 0' }}>
            <Container style={{ maxWidth: '960px' }}>
                <section style={{
                    background: 'linear-gradient(180deg, rgba(40,45,58,0.95), rgba(22,26,35,0.92))',
                    border: '1px solid #3f4756',
                    borderRadius: '24px',
                    boxShadow: '0 24px 70px rgba(0,0,0,0.35)',
                    padding: '2.5rem',
                    color: '#f8fafc'
                }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{
                            color: '#ccff00',
                            fontWeight: 800,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            marginBottom: '0.75rem',
                            fontSize: '0.85rem'
                        }}>
                            O nama
                        </p>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                            fontWeight: 900,
                            lineHeight: 1.05,
                            margin: 0
                        }}>
                            IronCore je mesto gde se pomeraju granice.
                        </h1>
                    </div>

                    <p style={{
                        color: '#cbd5e1',
                        fontSize: '1.05rem',
                        lineHeight: 1.9,
                        marginBottom: '1.5rem'
                    }}>
                        Dobrodošli u IronCore – mesto gde se pomeraju granice. Naša misija je da pružimo vrhunsko iskustvo treninga kroz najsavremeniju opremu, stručnu podršku i najkvalitetnije suplemente na tržištu. Svaki detalj u našem studiju je osmišljen da vas inspiriše, podstakne i ojača.
                    </p>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{
                            padding: '1.5rem',
                            background: '#1d212b',
                            border: '1px solid rgba(204, 255, 0, 0.16)',
                            borderRadius: '18px'
                        }}>
                            <h2 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem' }}>Naša vizija</h2>
                            <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                                Kreiramo zajednicu snažnih pojedinaca kojima je sport stil života. Svaki program, dodatak i usluga dolaze bez kompromisa, uz fokus na performanse i estetiku.
                            </p>
                        </div>
                        <div style={{
                            padding: '1.5rem',
                            background: '#1d212b',
                            border: '1px solid rgba(204, 255, 0, 0.16)',
                            borderRadius: '18px'
                        }}>
                            <h2 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem' }}>Premium oprema</h2>
                            <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                                U IronCore-u koristimo proverenu opremu i najnovije tehnologije kako bismo obezbedili treninge koji se osećaju intenzivno, ali bezbedno i profesionalno.
                            </p>
                        </div>
                        <div style={{
                            padding: '1.5rem',
                            background: '#1d212b',
                            border: '1px solid rgba(204, 255, 0, 0.16)',
                            borderRadius: '18px'
                        }}>
                            <h2 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem' }}>Stručna podrška</h2>
                            <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                                Naš tim stručnjaka je posvećen vašem napretku, sa personalizovanim savetima i planovima koji prate vaše ciljeve – od snage do oporavka.
                            </p>
                        </div>
                    </div>
                </section>
            </Container>
        </main>
    )
}

export default AboutScreen;
