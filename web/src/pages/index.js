import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import Head from '@docusaurus/Head';

function Home() {
    const context = useDocusaurusContext();
    const {siteConfig = {}} = context;
    return (
        <Layout>
            <Head>
                <meta name="description"
                      content="DeepLint empowers you to codify and enforce security standards and policies to secure and optimize any Cloud."/>

                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
                      integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog=="
                      crossOrigin="anonymous"/>
            </Head>
            <header className={clsx('hero', styles.heroBanner)}>
                <div className="container">
                    <div className="row">
                        <div className="col col--6">
                            <div>
                                <h1>DeepLint</h1>
                                <p>Use <strong>Security-as-Code</strong> to enforce best practices,
                                    standards, and policies on resource configurations of any Cloud and
                                    Infrastructure-as-Code.</p>
                                <p>DeepLint protects your cloud environments from:</p>
                                <div className="row">
                                    <div className="col">
                                        <ul>
                                            <li>Misconfigurations</li>
                                            <li>Data leakage</li>
                                            <li>IAM challenges</li>
                                            <li>Idle resources</li>
                                            <li>Compliance violations</li>
                                            <li>More</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className={styles.button}>
                                    <a className="button button--primary button--lg" href="/docs">Get started</a>
                                </div>
                            </div>
                        </div>
                        <div className="col col--offset-1 col--5">
                            <div><img src="img/top_banner.svg"/></div>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <section className={styles.bgBlue}>
                    <div className={clsx('container')}>
                        <div className={clsx('row', styles.sectionHeader)}>
                            <div className="col col--12 text--center">
                                <h2>Deliver Cloud Security and Governance as Code <br/> with DeepLint</h2>
                            </div>
                        </div>

                        <div className={clsx('row', styles.block)}>
                            <div className={clsx('col col--6')}>
                                <div className={styles.blocktext}>
                                    <h3>Build Security as Code</h3>
                                    <p>Embed into DevOps pipelines and integrate with third-party security services
                                        seamlessly and effortlessly.
                                    </p>
                                    <h4>Simple and Share</h4>
                                    <p>test</p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div><img
                                    src="https://www.terraform.io/assets/images/terraform-overview/declarative-config-files@4x-1bd3b268.png"/>
                                </div>
                            </div>
                        </div>

                        <div className={clsx('row', styles.block)}>
                            <div className="col col--6">
                                <div><img
                                    src="https://www.terraform.io/assets/images/terraform-overview/declarative-config-files@4x-1bd3b268.png"/>
                                </div>
                            </div>

                            <div className={clsx('col col--6')}>
                                <div className={styles.blocktext}>

                                    <h3>Enforce on any Cloud</h3>
                                    <p>Embed into DevOps pipelines and integrate with third-party security services
                                        seamlessly and effortlessly.
                                    </p>
                                    <h4>Simple and Share</h4>
                                    <p>test</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            </main>
        </Layout>
    );
}

export default Home;
