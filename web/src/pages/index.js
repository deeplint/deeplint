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
                                <h1>Find and fix problems in any Cloud</h1>
                                <p>Use <strong>Security as Code</strong> to improve security, reduce cost and stay
                                    compliant in any Cloud.</p>
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
                                <h2>Deliver Cloud Security and Governance as Code with DeepLint</h2>
                                <p>DeepLint enables you to build and enforce codified security packages per your
                                    best practices, standards, and policies to secure and optimize any Cloud in a consistent and
                                    repeatable way. Learn more <a href="/docs">here.</a></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-file-code fa-stack-1x fa-inverse"></i>
                                        </span>Codify</h3>
                                    <p>Codify security into three steps - collect resources, find problems, and fix.
                                        Manage security as code - version control, peer review, and sharing.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-cubes fa-stack-1x fa-inverse"></i>
                                        </span>Package</h3>
                                    <p>Package security required everything - resource scanners, checking rules, and
                                        fixing actions into a versioned and enforceable Package.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-handshake fa-stack-1x fa-inverse"></i>
                                        </span>
                                        Share
                                    </h3>
                                    <p>Share your best practices within the team or with the world. DeepLint pre-curated
                                        security packages based on common industry practices.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col col--4">
                                <div className={styles.feature}>

                                    <h3><span className={clsx('fa-stack fa-x', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-list fa-stack-1x fa-inverse"></i>
                                        </span>
                                        Configure
                                    </h3>
                                    <p>Choose and apply any security packages to check a single cloud environment or
                                        your entire cloud infrastructure in one configuration file.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack fa-x', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-shield-alt fa-stack-1x fa-inverse"></i>
                                        </span>Enforce</h3>
                                    <p>Snapshot configurations of cloud resources for auditing and visibility. Find and
                                        fix mistakes and policy violations consistently and repeatedly.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.feature}>

                                    <h3><span className={clsx('fa-stack fa-x', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-tools fa-stack-1x fa-inverse"></i>
                                        </span>Automate</h3>
                                    <p>Easily embed into CI/CD pipelines and integrate with existing security services
                                        to automate DevSecOps with one unified toolchain.
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
