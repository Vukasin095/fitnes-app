import { Container } from 'react-bootstrap'

const AboutScreen = () => {
    return (
        <main className='about-page-shell'>
            <Container className='about-container'>
                <section className='about-card'>
                    <div className='about-card-header'>
                        <p className='about-highlight'>
                            O nama
                        </p>
                        <h1 className='about-hero-heading'>
                            IronCore je mesto gde se pomeraju granice.
                        </h1>
                    </div>

                    <p className='about-text'>
                        Dobrodošli u IronCore – mesto gde se pomeraju granice. Naša misija je da pružimo vrhunsko iskustvo treninga kroz najsavremeniju opremu, stručnu podršku i najkvalitetnije suplemente na tržištu. Svaki detalj u našem studiju je osmišljen da vas inspiriše, podstakne i ojača.
                    </p>

                    <div className='about-feature-grid'>
                        <div className='about-feature-card'>
                            <h2 className='about-feature-title'>Naša vizija</h2>
                            <p className='about-feature-text'>
                                Kreiramo zajednicu snažnih pojedinaca kojima je sport stil života. Svaki program, dodatak i usluga dolaze bez kompromisa, uz fokus na performanse i estetiku.
                            </p>
                        </div>
                        <div className='about-feature-card'>
                            <h2 className='about-feature-title'>Premium oprema</h2>
                            <p className='about-feature-text'>
                                U IronCore-u koristimo proverenu opremu i najnovije tehnologije kako bismo obezbedili treninge koji se osećaju intenzivno, ali bezbedno i profesionalno.
                            </p>
                        </div>
                        <div className='about-feature-card'>
                            <h2 className='about-feature-title'>Stručna podrška</h2>
                            <p className='about-feature-text'>
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
