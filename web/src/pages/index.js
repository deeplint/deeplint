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
    const { siteConfig = {} } = context;
    return (
        <Layout>
            <Head>
                <meta name="description"
                    content="DeepLint is an open-source Cloud Security-as-Code framework that enables you to build, enforce, and manage security workflows as code to find, fix, and prevent costly mistakes in cloud configurations."/>
            </Head>
            <header className={clsx('hero', styles.heroBanner)}>
                <div className="container">
                    <div className="row">
                        <div className="col col--6">
                            <div>
                                <h1>DeepLint</h1>
                                <p>Use <strong>Security-as-Code</strong> to find, fix and prevent costly configuration mistakes in any Cloud and Infrastructure-as-Code.</p>
                                <p>DeepLint protects your cloud environments from:</p>
                                <div className="row">
                                    <div className="col">
                                        <ul>
                                            <li>Security threats</li>
                                            <li>Data leakage</li>
                                            <li>Compliance violations</li>
                                            <li>IAM challenges</li>
                                            <li>Idle resources</li>
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
                            <div><img src="img/top_banner.svg" /></div>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <section className={styles.bgBlue}>
                    <div className={clsx('container')}>
                        <div className={clsx('row', styles.sectionHeader)}>
                            <div className="col col--12 text--center">
                                <h2>Deliver Cloud Security as Code with DeepLint</h2>
                                <p>DeepLint is an open-source Security-as-Code framework that enables you build, enforce and share security workflows as code
                                    to secure and optimize cloud environments and Infrastructure-as-Code through entire DevOps lifecycle.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/policy.svg" /></div>
                                    <h3>Security as Code</h3>
                                    <p>Codified security workflows allow repeated and consistent usage, and can be managed as code - version control, peer review, and sharing.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/file.svg" /></div>
                                    <h3>DevSecOps</h3>
                                    <p>Embed security workflows into DevOps pipelines to secure and optimize Cloud without slowing down development and growth.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/cloud.svg" /></div>
                                    <h3>Multi Cloud</h3>
                                    <p>Use one unified tool to check multiple Cloud and Infrastructure-as-Code. Quickly elevate cloud security posture with pre-curated packages.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/trust.svg" /></div>
                                    <h3>Collaboration</h3>
                                    <p>Package and share your security best practices within the team. Automatically fix founded problems with shared fixing actions.
                                    </p>
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
